import localtunnel from 'localtunnel';

const tunnel = await localtunnel({ port: 3000 });

console.log('\n✅ האתר זמין בכתובת:');
console.log('   ' + tunnel.url);
console.log('\n🔑 סיסמה (אם מבוקשת): בדוק ב https://api.ipify.org');
console.log('\n⚠️  אל תסגור את החלון הזה — הטונל פעיל כל עוד החלון פתוח\n');

tunnel.on('close', () => {
  console.log('Tunnel closed. Reconnecting...');
  process.exit(1);
});

// Keep alive
process.on('SIGINT', () => { tunnel.close(); process.exit(0); });
