import { getItem, setItem } from '../utils/storage.js';

// Initialize with EMPTY data — no fake content
export function initializeMockData() {
  const CURRENT_VERSION = 'v5-empty';
  if (getItem('version') === CURRENT_VERSION) return;

  // Only set up user identities — everything else starts empty
  setItem('auth', {
    users: {
      'xia-mi': { name: '虾米', emoji: '🦐', color: '#FF6B6B' },
      'han-bao': { name: '汉堡', emoji: '🍔', color: '#FFB347' },
    }
  });

  setItem('memories', []);
  setItem('diary', []);
  setItem('letters', []);
  setItem('vouchers', []);
  setItem('expressions', []);
  setItem('quiz', []);
  setItem('countdowns', []);
  setItem('firsts', []);
  setItem('mailbox', []);

  setItem('version', CURRENT_VERSION);
}
