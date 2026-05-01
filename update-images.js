const fs = require('fs');

function updateLabTests() {
  let data = fs.readFileSync('src/lib/lab-tests-data.ts', 'utf8');
  if (!data.includes('image?: string;')) {
    data = data.replace('emoji: string;', 'emoji: string;\n  image?: string;');
  }
  
  const replacements = {
    'emoji: "🔬",': 'emoji: "🔬",\n    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🩸",': 'emoji: "🩸",\n    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🦋",': 'emoji: "🦋",\n    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",',
    'emoji: "📊",': 'emoji: "📊",\n    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",',
    'emoji: "❤️",': 'emoji: "❤️",\n    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🫀",': 'emoji: "🫀",\n    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🫘",': 'emoji: "🫘",\n    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",',
    'emoji: "☀️",': 'emoji: "☀️",\n    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🌸",': 'emoji: "🌸",\n    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80",',
    'emoji: "💓",': 'emoji: "💓",\n    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🦠",': 'emoji: "🦠",\n    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80",',
    'emoji: "📉",': 'emoji: "📉",\n    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",',
  };

  for (const [key, value] of Object.entries(replacements)) {
    if (!data.includes(value)) {
      data = data.replace(key, value);
    }
  }

  fs.writeFileSync('src/lib/lab-tests-data.ts', data);
  console.log('Lab tests updated.');
}

function updateDietPlans() {
  let data = fs.readFileSync('src/lib/diet-plans-data.ts', 'utf8');
  if (!data.includes('image?: string;')) {
    data = data.replace('emoji: string;', 'emoji: string;\n  image?: string;');
  }

  const replacements = {
    'emoji: "🏃",': 'emoji: "🏃",\n    image: "https://images.unsplash.com/photo-1490645935967-10de6ba82647?auto=format&fit=crop&w=400&q=80",',
    'emoji: "💪",': 'emoji: "💪",\n    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🩺",': 'emoji: "🩺",\n    image: "https://images.unsplash.com/photo-1498837167922-41c012202392?auto=format&fit=crop&w=400&q=80",',
    'emoji: "❤️",': 'emoji: "❤️",\n    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=400&q=80",',
    'emoji: "🌸",': 'emoji: "🌸",\n    image: "https://images.unsplash.com/photo-1490645935967-10de6ba82647?auto=format&fit=crop&w=400&q=80",',
    'emoji: "👶",': 'emoji: "👶",\n    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",',
  };

  for (const [key, value] of Object.entries(replacements)) {
    if (!data.includes(value)) {
      data = data.replace(key, value);
    }
  }

  fs.writeFileSync('src/lib/diet-plans-data.ts', data);
  console.log('Diet plans updated.');
}

updateLabTests();
updateDietPlans();
