import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 768,
  backgroundColor: '#ffffff',
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);
let wheel, needle, base, wheelstarted = false;
let coinsText;
let gemsText;
let coins = 2000; 
let gems = 5;     

const randomstops = [
  { rot: 685, value: 100, type: 'coin' },
  { rot: 725, value: 200, type: 'coin' },
  { rot: 1550, value: -200, type: 'coin' },
  { rot: 1580, value: 50, type: 'coin' },
  { rot: 1610, value: 1000, type: 'coin' },
  { rot: 765, value: 20, type: 'gem' },
  { rot: 640, value: -1000, type: 'coin' },
];

function preload() {
  this.load.image('wheel', 'public/assets/Wheel.png');
  this.load.image('needle', 'public/assets/Needle.png');
  this.load.image('base', 'public/assets/Base.png');
}

function create() {
  base = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'base');
  base.setOrigin(0.5);
  base.setScale(0.5);

  wheel = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 20, 'wheel');
  wheel.setOrigin(0.5);
  wheel.setScale(0.5);

  needle = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 185, 'needle');
  needle.setOrigin(0.5);
  needle.setScale(0.5);


  coinsText = this.add.text(10, 10, `Coins: ${coins}`, { fontSize: '16px', fill: '#000' });
  gemsText = this.add.text(10, 30, `Gems: ${gems}`, { fontSize: '16px', fill: '#000' });

  
  const spinButton = this.add.text(this.scale.width / 2, this.scale.height - 50, 'SPIN (-200)', { fontSize: '20px', fill: '#fff' })
    .setOrigin(0.5)
    .setBackgroundColor('#007bff')
    .setPadding(10)
    .setInteractive();

  spinButton.on('pointerdown', rotateTheWheel, this);
}

function rotateTheWheel() {
  if (!wheelstarted && coins >= 200) {
    wheelstarted = true;
    coins -= 200; 

    const randomnumber = Phaser.Math.Between(0, randomstops.length - 1);
    this.tweens.add({
      targets: wheel,
      angle: randomstops[randomnumber].rot,
      duration: 5000,
      ease: 'Cubic',
      onComplete: () => {
        const prizeValue = randomstops[randomnumber].value;
        const prizeType = randomstops[randomnumber].type;

        if (prizeValue < 0) {
          alert(`Sorry, you lost ${Math.abs(prizeValue)} ${prizeType}!`);
        } else {
          alert(`Congratulations, you won ${prizeValue} ${prizeType}!`);
        }

        
        if (prizeType === 'coin') {
          coins += prizeValue;
        } else if (prizeType === 'gem') {
          gems += prizeValue;
        }

       
        coinsText.setText(`Coins: ${coins}`);
        gemsText.setText(`Gems: ${gems}`);
        
        wheelstarted = false;
      }
    });
  } else if (coins < 200) {
    alert("You don't have enough coins to spin!");
  }
}
