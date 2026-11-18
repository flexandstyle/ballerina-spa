// Ballerina SPA — catalogue data
// Names/stats are demo content for partner review. Photos are placeholders.

const MASTERS = [
  { id: 'lara',  name: 'Lara',  age: 21, h: 171, w: 59, bust: 2,   vip: false, img: 'assets/img/m1.jpg' },
  { id: 'mila',  name: 'Mila',  age: 24, h: 168, w: 54, bust: 2.5, vip: true,  img: 'assets/img/m2.jpg' },
  { id: 'nina',  name: 'Nina',  age: 22, h: 164, w: 52, bust: 1.5, vip: false, img: 'assets/img/m3.jpg' },
  { id: 'sara',  name: 'Sara',  age: 26, h: 170, w: 58, bust: 3,   vip: true,  img: 'assets/img/m4.jpg' },
  { id: 'tea',   name: 'Tea',   age: 23, h: 166, w: 51, bust: 2,   vip: false, img: 'assets/img/m5.jpg' },
  { id: 'iva',   name: 'Iva',   age: 25, h: 173, w: 57, bust: 2,   vip: false, img: 'assets/img/m6.jpg' },
  { id: 'lea',   name: 'Lea',   age: 20, h: 162, w: 49, bust: 1.5, vip: true,  img: 'assets/img/m7.jpg' },
  { id: 'maja',  name: 'Maja',  age: 27, h: 169, w: 60, bust: 3,   vip: false, img: 'assets/img/m8.jpg' },
  { id: 'vera',  name: 'Vera',  age: 28, h: 167, w: 55, bust: 2.5, vip: false, img: 'assets/img/m9.jpg' },
];

// Program names are the same in every language (ballet terms);
// descriptions live in i18n.js under prog.<id>
const PROGRAMS = [
  { id: 'puant',     name: 'Puant',          price: 120, dur: 60,  vip: false, img: 'assets/img/a5.jpg' },
  { id: 'adagio',    name: 'Adagio',         price: 150, dur: 60,  vip: false, img: 'assets/img/a8.jpg' },
  { id: 'fouette',   name: 'Fouetté',        price: 180, dur: 90,  vip: false, img: 'assets/img/a1.jpg' },
  { id: 'pasdedeux', name: 'Pas de Deux',    price: 250, dur: 90,  vip: false, img: 'assets/img/a7.jpg' },
  { id: 'lebedinoe', name: 'Swan Lake',      price: 220, dur: 90,  vip: false, img: 'assets/img/a9.jpg' },
  { id: 'corsaire',  name: 'Le Corsaire',    price: 200, dur: 75,  vip: false, img: 'assets/img/a3.jpg' },
  { id: 'primadonna',name: 'Prima Donna',    price: 350, dur: 120, vip: true,  img: 'assets/img/a4.jpg' },
  { id: 'etoile',    name: 'Étoile',         price: 300, dur: 120, vip: true,  img: 'assets/img/a6.jpg' },
];

const CONTACTS = {
  phone: '+386 40 555 018',
  phoneHref: 'tel:+38640555018',
  tg: 'https://t.me/ballerina_spa',
  address: {
    sl: 'Ljubljana, Slovenska cesta 15',
    en: 'Ljubljana, Slovenska cesta 15',
    sr: 'Ljubljana, Slovenska cesta 15',
    ru: 'Любляна, Slovenska cesta 15',
  },
  // google maps embed — Ljubljana centre
  map: 'https://www.google.com/maps?q=Slovenska+cesta+15,+Ljubljana,+Slovenia&z=15&output=embed',
};
