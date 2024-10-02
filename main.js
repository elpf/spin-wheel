

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
let coinsText, notificationText, modalBackground, okButton;
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
  this.load.image('wheel', '/assets/wheel.png');
  this.load.image('needle', '/assets/needle.png');
  this.load.image('base', '/assets/base.png');
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

  // Modal background (putih untuk latar belakang)
  const modalWidth = this.scale.width * 0.6; // Smaller modal width
  const modalHeight = this.scale.height / 4; // 1/4 of window height

  modalBackground = this.add.graphics();
  modalBackground.fillStyle(0xffffff, 1); // Putih dengan opasitas penuh
  modalBackground.fillRect(this.scale.width / 2 - modalWidth / 2, this.scale.height / 2 - modalHeight / 2, modalWidth, modalHeight);
  modalBackground.setVisible(false); // Tidak terlihat kecuali diperlukan

  // Tambahkan teks notifikasi untuk menampilkan pesan di atas roda
  notificationText = this.add.text(this.scale.width / 2, this.scale.height / 2 - modalHeight / 4, '', { fontSize: '16px', fill: '#000', align: 'center', wordWrap: { width: modalWidth - 20 } });
  notificationText.setOrigin(0.5);
  notificationText.setVisible(false); // Awalnya tidak terlihat

  // Tombol OK untuk menutup modal
  okButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + modalHeight / 6, 'OK', { fontSize: '16px', fill: '#fff' }) // Adjusted the positioning
    .setOrigin(0.5)
    .setBackgroundColor('#007bff')
    .setPadding(10)
    .setInteractive();
  okButton.setVisible(false);

  okButton.on('pointerdown', () => {
    hideNotification(); // Sembunyikan modal saat tombol OK ditekan
  });

  const spinButton = this.add.text(this.scale.width / 2, this.scale.height - 50, 'SPIN (-200)', { fontSize: '20px', fill: '#fff' })
    .setOrigin(0.5)
    .setBackgroundColor('#007bff')
    .setPadding(5)
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
          showNotification(`Sorry, you lost ${Math.abs(prizeValue)} ${prizeType}!`, false);
        } else {
          showNotification(`Congratulations, you won ${prizeValue} ${prizeType}!`, true);
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
    showNotification("You don't have enough coins to spin!", false);
  }
}

// Fungsi untuk menampilkan notifikasi modal dan memicu confetti
function showNotification(message, isWin) {
  modalBackground.setVisible(true);
  notificationText.setText(message);
  notificationText.setVisible(true);
  okButton.setVisible(true);

  if (isWin) {
    triggerConfetti(); // Confetti dipicu saat menang
  }
}

// Fungsi untuk menyembunyikan modal notifikasi
function hideNotification() {
  modalBackground.setVisible(false);
  notificationText.setVisible(false);
  okButton.setVisible(false);
}

// Fungsi untuk men-trigger confetti
function triggerConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.3 },  // Lokasi confetti di sekitar roda
    colors: ['#ff0', '#ff4000', '#00f', '#0f0'] // Warna yang bervariasi
  });
}
