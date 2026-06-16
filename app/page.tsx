'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Flame, 
  Users, 
  Sparkles, 
  RotateCcw, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  Trophy, 
  ArrowLeft, 
  Info,
  Shuffle
} from 'lucide-react';

// ==========================================
// 1. DATASET DE JEU (ACTIONS ET VÉRITÉS)
// ==========================================

interface Challenge {
  id: string;
  text: string;
  penalty?: string;
}

interface CategoryData {
  truths: Challenge[];
  dares: Challenge[];
  description: string;
  icon: string;
  colorClass: string;
  glowClass: string;
}

const GAME_DATA: Record<string, CategoryData> = {
  family: {
    description: "Parfait pour s'amuser entre parents, enfants, ou frères et sœurs. Des questions bienveillantes et des défis hilarants sans gêne.",
    icon: "👨‍👩‍👧‍👦",
    colorClass: "from-cyan-500 to-blue-600",
    glowClass: "shadow-[0_0_20px_rgba(6,182,212,0.4)] border-cyan-500",
    truths: [
      { id: 'f_t1', text: "Quel est ton plus grand rêve dans la vie actuellement ?" },
      { id: 'f_t2', text: "Si tu pouvais changer une règle absolue à la maison, quelle serait-elle ?" },
      { id: 'f_t3', text: "Quel est le plat cuisiné à la maison que tu détestes le plus ?" },
      { id: 'f_t4', text: "Quelle est la pire bêtise que tu as faite récemment sans que personne ne s'en rende compte ?" },
      { id: 'f_t5', text: "Si tu devais être un animal, lequel serais-tu et pour quelle raison ?" },
      { id: 'f_t6', text: "Quelle corvée ménagère as-tu le plus en horreur ?" },
      { id: 'f_t7', text: "Quel est ton souvenir de vacances en famille le plus drôle ou le plus mémorable ?" },
      { id: 'f_t8', text: "Si tu devenais invisible pendant une journée complète, que ferais-tu ?" },
      { id: 'f_t9', text: "Si tu pouvais échanger ta place avec un autre membre de la famille pour une journée complète, que ferais-tu ?" },
      { id: 'f_t10', text: "Quel est le plus grand mensonge que tu as dit à tes proches sans jamais te faire démasquer ?" },
      { id: 'f_t11', text: "Quel super-pouvoir t'aiderait le plus à esquiver les corvées de la maison ?" },
      { id: 'f_t12', text: "Quel dessin animé ou film préféré as-tu secrètement honte d'aimer ?" },
      { id: 'f_t13', text: "Qui est selon toi la personne la plus drôle dans la pièce et pourquoi ?" },
      { id: 'f_t14', text: "Si tu devais vivre sur une île déserte avec un seul autre joueur, qui choisirais-tu ?" },
      { id: 'f_t15', text: "Quelle est ta plus grande peur insolite ou ridicule (araignées, noir, bruits bizarres) ?" },
      { id: 'f_t16', text: "Quel est ton pire souvenir culinaire préparé par l'un de tes proches ?" },
      { id: 'f_t17', text: "Si tu gagnais au loto demain, quelle est la première chose que tu achèterais pour le groupe ?" },
      { id: 'f_t18', text: "Quel objet de ta chambre ou de la maison aimerais-tu secrètement jeter ou faire disparaître ?" }
    ],
    dares: [
      { id: 'f_d1', text: "Fais ta meilleure imitation d'un singe excité pendant 20 secondes." },
      { id: 'f_d2', text: "Raconte la blague la plus drôle que tu connaisses et essaie de faire rire au moins une personne." },
      { id: 'f_d3', text: "Fais le tour complet de la pièce en marchant comme un pingouin." },
      { id: 'f_d4', text: "Récite l'alphabet à l'envers le plus rapidement possible sans commettre d'erreur." },
      { id: 'f_d5', text: "Chante le refrain de ta chanson du moment avec une voix d'opéra dramatique." },
      { id: 'f_d6', text: "Dessine le portrait d'un autre joueur en moins de 45 secondes sans jamais lever ton stylo de la feuille." },
      { id: 'f_d7', text: "Tiens en équilibre sur un seul pied pendant une minute entière tout en faisant des grimaces." },
      { id: 'f_d8', text: "Fais une imitation parfaite de ton père, de ta mère ou d'un membre de la pièce jusqu'à ce que les autres devinent." },
      { id: 'f_d9', text: "Mange une tranche de citron entière (ou un aliment acide) sans faire la moindre grimace." },
      { id: 'f_d10', text: "Réalise ta plus belle danse de robot futuriste pendant 30 secondes." },
      { id: 'f_d11', text: "Récite un poème dramatique ou une chanson connue en remplaçant tous les verbes par le mot 'prout'." },
      { id: 'f_d12', text: "Laisse un autre joueur te coiffer d'une manière totalement loufoque (crête, couettes, etc.) !" },
      { id: 'f_d13', text: "Parle uniquement en rimes jusqu'au début de ton prochain tour de jeu." },
      { id: 'f_d14', text: "Fais comme si tu étais une statue figée pendant une minute entière, même si on essaie de t'arracher un rire." },
      { id: 'f_d15', text: "Essaie de toucher le bout de ton nez avec ta langue, ou fais ta grimace la plus effrayante." },
      { id: 'f_d16', text: "Fais une déclaration solennelle très sérieuse en t'adressant à la télévision ou à un meuble de la pièce." },
      { id: 'f_d17', text: "Fais 5 fentes d'affilée en chantant une berceuse enfantine le plus fort possible." }
    ]
  },
  party: {
    description: "Le mode idéal pour les soirées entre amis. Préparez-vous à révéler vos secrets les mieux gardés et à relever des défis délirants !",
    icon: "🎉",
    colorClass: "from-violet-500 to-purple-600",
    glowClass: "shadow-[0_0_20px_rgba(139,92,246,0.4)] border-violet-500",
    truths: [
      { id: 'p_t1', text: "Quelle est la pire excuse bidon que tu as déjà inventée pour annuler une sortie à la dernière minute ?" },
      { id: 'p_t2', text: "D'après toi, quel est ton plus grand défaut aux yeux de tes amis dans cette pièce ?" },
      { id: 'p_t3', text: "Quelle est la chanson honteuse que tu écoutes en boucle en cachette (ton plaisir coupable) ?" },
      { id: 'p_t4', text: "Si tu devais échanger ta vie avec l'un des joueurs présents ici pour une semaine, qui choisirais-tu ?" },
      { id: 'p_t5', text: "Quel est le comportement ou le défaut qui t'agace instantanément chez quelqu'un ?" },
      { id: 'p_t6', text: "As-tu déjà espionné le compte de quelqu'un sur les réseaux d'un peu trop près ?" },
      { id: 'p_t7', text: "Quelle est la chose la plus ridicule ou inutile que tu as achetée sous le coup de l'impulsion récemment ?" },
      { id: 'p_t8', text: "Quel a été ton pire moment de solitude ou la situation la plus embarrassante de ta vie ?" },
      { id: 'p_t9', text: "Quelle est ton habitude ou ton rituel en soirée le plus bizarre ou gênant ?" },
      { id: 'p_t10', text: "De tous les joueurs présents, avec qui refuserais-tu catégoriquement de partir en voyage de survie sauvage ?" },
      { id: 'p_t11', text: "Quel est le dernier message particulièrement compromettant ou drôle que tu as envoyé ou reçu ?" },
      { id: 'p_t12', text: "Si tu devais supprimer définitivement l'un de tes réseaux sociaux, lequel choisirais-tu et pourquoi ?" },
      { id: 'p_t13', text: "As-tu déjà fait semblant de ne pas voir ou d'ignorer quelqu'un dans la rue pour éviter de lui dire bonjour ?" },
      { id: 'p_t14', text: "Quelle est la rumeur ou le ragot le plus fou que tu as colporté ou entendu sur ton propre compte ?" },
      { id: 'p_t15', text: "Si tu devais confier le code secret de ton mobile à un seul joueur présent, à qui ferais-tu le moins confiance ?" },
      { id: 'p_t16', text: "Quelle est la pire décision romantique ou amicale que tu as prise sous l'effet de l'ambiance d'une soirée tardive ?" },
      { id: 'p_t17', text: "Quel est le défi ou gage de cette partie que tu redoutes secrètement par-dessus tout ?" },
      { id: 'p_t18', text: "Combien de jours as-tu déjà passés d'affilée sans te doucher (ton record le plus inavouable) ?" }
    ],
    dares: [
      { id: 'p_d1', text: "Fais une déclaration d'amour ultra romantique et théâtrale à l'objet à ta droite ou au balai de la cuisine." },
      { id: 'p_d2', text: "Parle avec un accent étranger au choix (québécois, marseillais, british...) jusqu'au début de ton prochain tour." },
      { id: 'p_d3', text: "Danse de la façon la plus ridicule possible pendant 30 secondes sans aucune musique de fond." },
      { id: 'p_d4', text: "Laisse un autre joueur rédiger et envoyer un SMS farfelu contenant ton choix de destinataire parmi tes contacts." },
      { id: 'p_d5', text: "Imite un présentateur de documentaire animalier qui décrit les moindres faits et gestes d'un joueur à côté de toi." },
      { id: 'p_d6', text: "Fais 10 pompes d'affilée en hurlant à chaque fois : 'Je suis absolument irrésistible !'" },
      { id: 'p_d7', text: "Essaie de vendre n'importe quel objet de la pièce à un autre joueur comme si c'était une antiquité inestimable." },
      { id: 'p_d8', text: "Sers de majordome personnel au joueur à ta gauche pendant les 2 prochains tours (sers-lui à boire, réponds à ses désirs)." },
      { id: 'p_d9', text: "Fais une séance de mime express : mime 3 animaux différents choisis par l'assemblée en moins de 45 secondes." },
      { id: 'p_d10', text: "Envoie un message vocal ou un SMS humoristique et absurde au 5ème contact de ton historique de chat." },
      { id: 'p_d11', text: "Danse une salsa passionnée et endiablée avec un partenaire imaginaire pendant 45 secondes." },
      { id: 'p_d12', text: "Mélange 3 boissons différentes du buffet et bois cul sec une petite tasse de cette mixture insolite." },
      { id: 'p_d13', text: "Essaie sérieusement d'embrasser ou de lécher ton propre coude pendant 20 secondes sous le regard de tous." },
      { id: 'p_d14', text: "Réalise un défilé de haute couture digne des plus grands en utilisant un objet absurde de la pièce comme accessoire phare." },
      { id: 'p_d15', text: "Parle comme un pirate (en rajoutant des 'Moussaillon !' et des 'Mille sabords !') jusqu'à ton prochain tour." },
      { id: 'p_d16', text: "Présente d'une voix sérieuse d'influenceur beauté les mérites révolutionnaires d'une brosse à dents ou d'un stylo." }
    ]
  },
  spicy: {
    description: "Pour monter la température ! Idéal pour les couples ou les groupes d'amis très proches en quête d'anecdotes croustillantes et de défis coquins.",
    icon: "🔥",
    colorClass: "from-rose-500 to-pink-600",
    glowClass: "shadow-[0_0_20px_rgba(244,63,94,0.4)] border-rose-500",
    truths: [
      { id: 's_t1', text: "Quel est ton plus grand plaisir coupable inavouable ?" },
      { id: 's_t2', text: "Quelle est la folie orignale ou romantique la plus marquante que tu aies faite par attraction pour quelqu'un ?" },
      { id: 's_t3', text: "Définit les critères de ton rendez-vous galant absolument parfait." },
      { id: 's_t4', text: "S'il ne devait rester qu'un seul joueur dans cette pièce avec qui tu passerais une soirée intime, qui serait-ce ?" },
      { id: 's_t5', text: "Quelle est ta technique secrète imparable pour séduire ou flatter quelqu'un qui te plaît ?" },
      { id: 's_t6', text: "De quel joueur présent te sens-tu le plus proche émotionnellement ou physiquement en ce moment ?" },
      { id: 's_t7', text: "Quelle partie du corps trouves-tu instantanément la plus séduisante chez ton partenaire idéal ?" },
      { id: 's_t8', text: "As-tu déjà craqué en secret pour le partenaire de l'un de tes bons amis ?" },
      { id: 's_t9', text: "As-tu déjà eu une attirance inattendue ou un coup de foudre caché pour quelqu'un présent dans cette pièce ?" },
      { id: 's_t10', text: "Quelle tenue vestimentaire ou accessoire te fait instantanément craquer chez quelqu'un ?" },
      { id: 's_t11', text: "Quel est l'endroit le plus insolite ou risqué où tu as déjà partagé un baiser passionné (ou plus) ?" },
      { id: 's_t12', text: "Qu'est-ce qui t'attire physiquement ou esthétiquement le plus chez ton voisin de droite ?" },
      { id: 's_t13', text: "Quelle est ta plus grande fantasme ou rêve romantique dont tu n'as presque jamais osé parler ?" },
      { id: 's_t14', text: "Quel est le compliment intime ou charmant qui t'a le plus troublé de toute ta vie ?" },
      { id: 's_t15', text: "As-tu déjà envoyé ou reçu des messages particulièrement suggestifs (comme des sextos) ?" },
      { id: 's_t16', text: "Si tu devais caractériser ton propre style de séduction en un unique adjectif, lequel serait-il ?" },
      { id: 's_t17', text: "As-tu déjà fait semblant d'apprécier intensément ou simulé de l'enthousiasme lors d'un rendez-vous galant ?" },
      { id: 's_t18', text: "Selon toi, qui dans ce groupe possède la voix ou l'attitude la plus irrésistiblement sensuelle ?" }
    ],
    dares: [
      { id: 's_d1', text: "Fixe le joueur d'en face droit dans les yeux avec ton regard le plus enflammé et hypnotique pendant 20 secondes." },
      { id: 's_d2', text: "Chuchote un compliment sincère mais follement séduisant à l'oreille du joueur situé à ta droite." },
      { id: 's_d3', text: "Fais un massage de tête ou d'épaules divinement relaxant de 45 secondes au joueur de ton choix." },
      { id: 's_d4', text: "Mange un fruit ou un aliment disponible dans la pièce de la manière la plus voluptueuse possible." },
      { id: 's_d5', text: "Fais une battle de regards intenses de 15 secondes avec le joueur que tu trouves le plus charismatique." },
      { id: 's_d6', text: "Dévoile un petit secret romantique ou amusant à voix basse à la personne de gauche." },
      { id: 's_d7', text: "Fais une danse lente et sensuelle de 15 secondes devant le joueur de ton choix." },
      { id: 's_d8', text: "Murmure une confession fantaisiste d'une voix langoureuse ou sensuelle au joueur de ton choix." },
      { id: 's_d9', text: "Écrit un compliment audacieux sur le bras d'un autre joueur ou trace-le doucement du bout des doigts." },
      { id: 's_d10', text: "Fais un clin d'œil ultra charmeur et énigmatique à chaque joueur l'un après l'autre." },
      { id: 's_d11', text: "Laisse le joueur à ta droite te dessiner un petit tatouage temporaire inoffensif (comme un cœur ou un éclair) sur le poignet." },
      { id: 's_d12', text: "Lis à haute voix une étiquette de bouteille ou une notice d'une manière incroyablement enflammée et sensuelle." },
      { id: 's_d13', text: "Décris à voix haute le baiser idéal à tes yeux en fermant les yeux pendant 30 secondes." },
      { id: 's_d14', text: "Fais un massage des mains de 30 secondes extrêmement attentionné au joueur assis face à toi." },
      { id: 's_d15', text: "Enlève un accessoire ou un article de ton choix (comme une veste, une chaussette, ou un bijou) de façon théâtrale." },
      { id: 's_d16', text: "Rejoue une scène romantique culte de film durant 20 secondes avec le joueur de ton choix." },
      { id: 's_d17', text: "Frotte doucement ton nez contre le nez du joueur à ta gauche (un bisou d'esquimau chaleureux)." }
    ]
  }
};

// Liste amusante de gages / pénalités si un joueur décide de passer
const PENALTIES = [
  "Prends 2 gorgées de ta boisson !",
  "Bois une double gorgée de ta boisson ou bois un grand verre d'eau d'un coup !",
  "Fais 15 sauts en étoile sur place sans t'arrêter !",
  "Fais une grimace horrible et laisse les autres te prendre en photo !",
  "Fais le tour de la pièce à cloche-pied en criant 'Je suis un dindon !'",
  "Imite l'animal choisi par ton voisin de droite jusqu'à ce que quelqu'un rit.",
  "Chante une chanson de ton enfance ou un générique de dessin animé.",
  "Laisse ton voisin de gauche te coiffer ou te maquiller rapidement.",
  "Fais la planche ou tiens en gainage pendant 30 secondes."
];

// ==========================================
// TYPES DE L'ÉTAT DU JEU
// ==========================================

interface Player {
  id: string;
  name: string;
  score: number;       // Nombre de défis réussis
  challengesCount: number; // Nombre total de défis essayés
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
}

export default function TruthOrDareGame() {
  // --- États fondamentaux ---
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Alice', score: 0, challengesCount: 0 },
    { id: '2', name: 'Thomas', score: 0, challengesCount: 0 },
    { id: '3', name: 'Sarah', score: 0, challengesCount: 0 },
    { id: '4', name: 'Hugo', score: 0, challengesCount: 0 },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('party');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // --- Gestion de la partie active ---
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [choice, setChoice] = useState<'truth' | 'dare' | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [currentPenaltyText, setCurrentPenaltyText] = useState('');

  // --- Historique pour éviter la répétition rapide ---
  const [usedChallengeIds, setUsedChallengeIds] = useState<string[]>([]);

  // --- Effets visuels ---
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextParticleId = useRef(0);

  // ==========================================
  // SYSTÈME DE SONS SYNTHÉTIQUES (Web Audio API)
  // ==========================================
  
  const playSound = (type: 'click' | 'success' | 'fail' | 'transition' | 'sparkle') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.08); // D6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        // Son de victoire majeur ascendant rapide
        const now = ctx.currentTime;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.18); // C6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
      } else if (type === 'fail') {
        // Son de pénalité / buzzer déscendant farfelu
        const now = ctx.currentTime;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start();
        osc.stop(now + 0.25);
      } else if (type === 'transition') {
        // Balayage doux SFX du deck
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.18);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.18);
        osc.start();
        osc.stop(now + 0.18);
      } else if (type === 'sparkle') {
        // Arpège de petite magie
        const now = ctx.currentTime;
        osc.type = 'sine';
        const frequencies = [880, 987, 1174, 1318];
        frequencies.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, now + idx * 0.04);
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNode.gain.setValueAtTime(0.04, now + idx * 0.04);
          gainNode.gain.linearRampToValueAtTime(0, now + idx * 0.04 + 0.1);
          oscNode.start(now + idx * 0.04);
          oscNode.stop(now + idx * 0.04 + 0.1);
        });
      }
    } catch (e) {
      // Ignorer gentiment si l'audio n'est pas autorisé par la stratégie du site
    }
  };

  // ==========================================
  // FONCTIONNALITÉS LOGIQUE DES JOUEURS
  // ==========================================

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    
    // Éviter les noms identiques
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      playSound('fail');
      alert("Ce joueur existe déjà dans la liste !");
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      score: 0,
      challengesCount: 0
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    playSound('click');
  };

  const handleRemovePlayer = (id: string) => {
    // Garder au moins un joueur vide possible, mais avertir
    setPlayers(players.filter(p => p.id !== id));
    playSound('fail');
  };

  const handleAddSamplePlayers = () => {
    const samples = ["Arthur", "Charlotte", "Manon", "Maxime"];
    const currentNames = players.map(p => p.name.toLowerCase());
    const added: Player[] = [];
    
    samples.forEach((name, idx) => {
      if (!currentNames.includes(name.toLowerCase())) {
        added.push({
          id: `sample-${idx}-${Date.now()}`,
          name,
          score: 0,
          challengesCount: 0
        });
      }
    });

    if (added.length > 0) {
      setPlayers([...players, ...added]);
      playSound('sparkle');
    }
  };

  const startNewGame = () => {
    if (players.length < 2) {
      playSound('fail');
      return;
    }
    
    // Réinitialisation des scores et états
    const resetPlayers = players.map(p => ({ ...p, score: 0, challengesCount: 0 }));
    setPlayers(resetPlayers);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setChoice(null);
    setSelectedChallenge(null);
    setRevealed(false);
    setShowPenalty(false);
    setUsedChallengeIds([]);
    setIsPlaying(true);
    playSound('transition');
  };

  const resetToMainMenu = () => {
    if (window.confirm("Êtes-vous sûr de vouloir arrêter la partie actuelle et revenir à l'accueil ?")) {
      setIsPlaying(false);
      setChoice(null);
      setSelectedChallenge(null);
      setRevealed(false);
      setShowPenalty(false);
      playSound('transition');
    }
  };

  // ==========================================
  // SÉLECTION DES DÉFIS & LOGIQUE DE JEU
  // ==========================================

  const selectChallenge = (type: 'truth' | 'dare') => {
    playSound('click');
    setChoice(type);
    
    const category = GAME_DATA[selectedCategory];
    const pool = type === 'truth' ? category.truths : category.dares;
    
    // Filtrer pour éviter les doublons récents (sinon vider l'historique si tout a été joué)
    let available = pool.filter(c => !usedChallengeIds.includes(c.id));
    if (available.length === 0) {
      // Vider seulement l'historique de ce type pour cette catégorie
      const idsToRemove = pool.map(c => c.id);
      setUsedChallengeIds(prev => prev.filter(id => !idsToRemove.includes(id)));
      available = pool;
    }

    // Prendre un défi aléatoire
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];

    setSelectedChallenge(chosen);
    setUsedChallengeIds(prev => [...prev, chosen.id]);
    setRevealed(true);
    setShowPenalty(false);
  };

  const handleChallengeSuccess = (e: React.MouseEvent) => {
    // Confetti / Explosion particles
    spawnSuccessConfetti(e);
    playSound('success');

    // Mettre à jour l'utilisateur actif
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return {
          ...p,
          score: p.score + 1,
          challengesCount: p.challengesCount + 1
        };
      }
      return p;
    }));

    // Passer au joueur suivant
    nextTurn();
  };

  const handleChallengeSkip = () => {
    playSound('fail');
    
    // Générer une pénalité cocasse aléatoire
    const randomPenalty = PENALTIES[Math.floor(Math.random() * PENALTIES.length)];
    setCurrentPenaltyText(randomPenalty);
    setShowPenalty(true);
  };

  const confirmPenaltyCompleted = () => {
    // Pénalisation subie : passe son tour sans marquer de point, incrémente le compteur
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return {
          ...p,
          challengesCount: p.challengesCount + 1
        };
      }
      return p;
    }));

    playSound('click');
    setShowPenalty(false);
    nextTurn();
  };

  const nextTurn = () => {
    // Animation de transition
    setChoice(null);
    setSelectedChallenge(null);
    setRevealed(false);
    setShowPenalty(false);

    // Calculer l'index suivant
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);

    // Si on a fait un tour complet, on augmente le compteur de round
    if (nextIndex === 0) {
      setCurrentRound(prev => prev + 1);
    }
  };

  // ==========================================
  // SYSTÈME DE CONFETTIS PARTICULES
  // ==========================================

  const spawnSuccessConfetti = (e: React.MouseEvent) => {
    const parent = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - parent.left;
    const startY = e.clientY - parent.top;

    const colors = ['#22d3ee', '#f43f5e', '#a855f7', '#34d399', '#fbbf24', '#f472b6'];
    const newParticles: Particle[] = [];

    // Spawne 30 particules festives autour du clic
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      const size = 4 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        id: nextParticleId.current++,
        x: startX,
        y: startY,
        color,
        size,
        angle,
        speed
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Met à jour les particules à la fréquence de rendu
  useEffect(() => {
    if (particles.length === 0) return;

    let animFrame: number;
    const updateMotion = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed + 1.2, // Légère gravité
            speed: p.speed * 0.95, // Frottement de l'air
            size: p.size * 0.97 // Réduction de taille progressive
          }))
          .filter(p => p.size > 0.8 && p.y < 800)
      );
      animFrame = requestAnimationFrame(updateMotion);
    };

    animFrame = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(animFrame);
  }, [particles]);

  // ==========================================
  // RENDU PRINCIPAL
  // ==========================================

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 md:p-6 overflow-x-hidden selection:bg-rose-500/30 selection:text-white bg-[#0c0c1e]">
      
      {/* Decorative Mesh Gradients from Elegant Dark theme */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7000ff] opacity-10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff007f] opacity-10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* EN-TÊTE GLOBAL */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between px-4 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#7000ff] to-[#ff007f] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(112,0,255,0.4)]">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white italic">
            TRUTH <span className="text-[#ff007f]">OR</span> DARE
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Mode: <span className="text-white font-bold">{selectedCategory === 'family' ? 'Famille 👨‍👩‍👧‍👦' : selectedCategory === 'party' ? 'Fun/Soirée 🥳' : 'Spicy 🔥'}</span>
          </div>

          {/* Mute toggle button */}
          <button 
            type="button"
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) {
                setTimeout(() => playSound('sparkle'), 50);
              }
            }}
            id="toggle-audio-sfx"
            className="flex items-center justify-center w-8.5 h-8.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            title={isMuted ? "Activer les effets sonores" : "Désactiver les effets sonores"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL DE L'APPLICATION */}
      <main className="relative z-10 w-full max-w-xl flex-1 flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            // ==========================================
            // ÉCRAN 1 : CONFIGURATION ET PLAYERS (Elegant Dark)
            // ==========================================
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 w-full bg-white/5 rounded-3xl p-5 md:p-6 border border-white/10 shadow-2xl backdrop-blur-xl"
            >
              {/* Carte d'information / pitch du jeu */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7000ff]/10 to-[#ff007f]/10 p-5 border border-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-4 h-4 text-[#ff007f] animate-pulse" />
                  <h2 className="font-display font-semibold text-xs tracking-wider text-slate-200 uppercase">{"Le Jeu d'ambiance Ultime"}</h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {"Ajoutez de 2 à 15 participants, choisissez le mode idéal pour votre soirée, puis laissez le destin faire le reste. Fous rires et secrets révélés garantis !"}
                </p>
              </div>

              {/* Section d'ajout des joueurs */}
              <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/25 p-4.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    Joueurs ({players.length})
                  </label>
                  
                  {players.length === 0 && (
                    <button
                      type="button"
                      onClick={handleAddSamplePlayers}
                      id="add-sample-players-btn"
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer bg-cyan-950/45 px-3 py-1 rounded-full border border-cyan-500/20 font-semibold uppercase tracking-wider"
                    >
                      <Sparkles className="w-3 h-3" />
                      Ajouter démos
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddPlayer} className="flex gap-2 relative">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Entrez un prénom..."
                    maxLength={15}
                    id="player-name-input"
                    className="flex-1 px-4 py-3 text-sm rounded-xl border border-white/10 bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7000ff]/50 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!newPlayerName.trim()}
                    id="add-player-submit"
                    className="flex items-center justify-center bg-[#7000ff] hover:bg-[#821cff] disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(112,0,255,0.3)] hover:shadow-[0_0_20px_rgba(112,0,255,0.5)] cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {/* Liste des joueurs ajoutés */}
                <div className="max-h-[140px] overflow-y-auto pr-1 flex flex-wrap gap-2 mt-1 scrollbar-thin">
                  <AnimatePresence initial={false}>
                    {players.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full text-center py-4 text-xs text-slate-500 italic font-mono"
                      >
                        Aucun joueur pour le moment... Ajoutez-en au moins 2 !
                      </motion.div>
                    ) : (
                      players.map((player, idx) => (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-200 text-xs font-semibold hover:border-white/20 hover:bg-white/10 transition-all group shadow-sm"
                        >
                          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7000ff]/30 to-[#ff007f]/30 flex items-center justify-center font-mono text-[9px] text-pink-300">
                            {idx + 1}
                          </span>
                          <span>{player.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(player.id)}
                            className="text-slate-500 hover:text-[#ff007f] p-0.5 rounded transition-colors"
                            title={`Supprimer ${player.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sélection du mode de jeu */}
              <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/25 p-4.5">
                <label className="text-xs font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                  <Shuffle className="w-3.5 h-3.5 text-purple-400" />
                  Sélectionner un mode de jeu
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(GAME_DATA).map(([key, value]) => {
                    const isSelected = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(key);
                          playSound('click');
                        }}
                        className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? `bg-gradient-to-b from-[#7000ff]/20 to-transparent border-[#7000ff] shadow-[0_0_15px_rgba(112,0,255,0.2)]`
                            : `bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]`
                        }`}
                      >
                        <div className="text-2xl mb-1">{value.icon}</div>
                        <h3 className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">
                          {key === 'family' ? 'Famille' : key === 'party' ? 'Soirée' : 'Spicy'}
                        </h3>
                      </button>
                    );
                  })}
                </div>

                {/* Explications fines de la catégorie sélectionnée */}
                <div className="text-[11px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
                  {GAME_DATA[selectedCategory].description}
                </div>
              </div>

              {/* Bouton brillant de lancement */}
              <button
                type="button"
                onClick={startNewGame}
                disabled={players.length < 2}
                id="start-game-btn"
                className="w-full relative py-4 rounded-2xl font-display font-extrabold tracking-widest uppercase text-xs flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#7000ff] to-[#ff007f] hover:from-[#821cff] hover:to-[#ff1a8c] transition-all shadow-[0_0_25px_rgba(112,0,255,0.35)] hover:shadow-[0_0_35px_rgba(112,0,255,0.55)] cursor-pointer disabled:from-slate-900 disabled:to-slate-900 disabled:cursor-not-allowed disabled:text-slate-500 disabled:shadow-none disabled:border disabled:border-white/5"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Commencer la partie
              </button>

              {players.length < 2 && (
                <p className="text-center text-[10px] text-slate-500 italic">
                  * Ajoutez au moins deux joueurs de la soirée pour pouvoir lancer.
                </p>
              )}
            </motion.div>
          ) : (
            // ==========================================
            // ÉCRAN 2 : JEU EN COURS (JEU PRINCIPAL)
            // ==========================================
            <motion.div
              key="game-play-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              {/* STATUS BAR DU JEU */}
              <div className="flex items-center justify-between text-xs bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 backdrop-blur-md">
                <span className="text-slate-400 font-mono tracking-wider font-semibold">
                  ROUND {currentRound}
                </span>

                <div className="flex items-center gap-1.5 bg-[#7000ff]/10 text-purple-300 px-3 py-1 rounded-full border border-[#7000ff]/20 font-sans font-semibold text-[10px] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-pink-500" />
                  Mode {selectedCategory === 'family' ? 'Famille' : selectedCategory === 'party' ? 'Soirée' : 'Spicy'}
                </div>

                <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                  <span>Score: {currentPlayer.score} pts</span>
                </div>
              </div>

              {/* ACTIVE PLAYER STATUS (Elegant Dark Design Style) */}
              <div className="text-center my-3">
                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">{"C'est au tour de..."}</p>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] underline decoration-[#7000ff] decoration-8 underline-offset-8 uppercase">
                  {currentPlayer.name}
                </h2>
              </div>

              {/* CARTE CENTRALE DYNAMIQUE */}
              <div className="relative min-h-[340px] flex items-center justify-center">
                {/* Toile pour les confettis */}
                <div className="absolute inset-0 z-50 pointer-events-none">
                  {particles.map(p => (
                    <div
                      key={p.id}
                      className="absolute rounded-sm rotate-45"
                      style={{
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        transform: `rotate(${p.angle * 45}deg)`,
                        opacity: p.size > 2 ? 0.9 : 0
                      }}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {!choice ? (
                    // ÉTAPE A : LE JOUEUR DOIT CHOISIR ACTION OU VÉRITÉ
                    <motion.div
                      key="select-mode-prompt"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full grid grid-cols-2 gap-6 items-center content-center relative py-6"
                    >
                      {/* VÉRITÉ CHOICE */}
                      <button
                        type="button"
                        onClick={() => selectChallenge('truth')}
                        id="btn-choose-truth"
                        className="group relative cursor-pointer select-none text-left h-full"
                      >
                        <div className="absolute -inset-1 bg-cyan-500 rounded-[2.5rem] blur opacity-15 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative flex flex-col items-center justify-center aspect-[4/5] bg-slate-900/40 border-2 border-cyan-500/50 rounded-[2.5rem] p-6 text-center backdrop-blur-xl h-full">
                          <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-cyan-400 italic tracking-tighter mb-1.5 uppercase">VÉRITÉ</h3>
                          <p className="text-cyan-100/60 text-[10px] md:text-xs leading-relaxed max-w-[130px]">
                            Pose une question indiscrète ou révèle un secret enfoui.
                          </p>
                        </div>
                      </button>

                      {/* MIDDLE OR/VS WALL OVERLAY */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="w-12 h-12 bg-[#0c0c1e] border-2 border-white/20 rounded-full flex items-center justify-center font-black text-white italic shadow-2xl">
                          VS
                        </div>
                      </div>

                      {/* ACTION CHOICE */}
                      <button
                        type="button"
                        onClick={() => selectChallenge('dare')}
                        id="btn-choose-dare"
                        className="group relative cursor-pointer select-none text-left h-full"
                      >
                        <div className="absolute -inset-1 bg-[#ff007f] rounded-[2.5rem] blur opacity-15 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative flex flex-col items-center justify-center aspect-[4/5] bg-slate-900/40 border-2 border-pink-500/50 rounded-[2.5rem] p-6 text-center backdrop-blur-xl h-full">
                          <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                            <Flame className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-pink-400 italic tracking-tighter mb-1.5 uppercase">ACTION</h3>
                          <p className="text-pink-100/60 text-[10px] md:text-xs leading-relaxed max-w-[130px]">
                            Réalise un défi fou et excentrique devant tout le monde.
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  ) : (
                    // ÉTAPE B : CARTE DÉFI ACTIF ET RÉVÉLÉE
                    <motion.div
                      key="reveal-card-active"
                      initial={{ opacity: 0, rotateY: 90, scale: 0.95 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      className={`relative w-full rounded-[2.5rem] border-2 p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl ${
                        choice === 'truth'
                          ? 'border-cyan-500/50 bg-[#071625]/95 shadow-[0_0_40px_rgba(34,211,238,0.2)]'
                          : 'border-pink-500/50 bg-[#25071a]/95 shadow-[0_0_40px_rgba(244,63,94,0.2)]'
                      }`}
                      style={{ perspective: 1000 }}
                    >
                      {/* Aura lumineuse interne */}
                      <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-[50px] opacity-30 ${
                        choice === 'truth' ? 'bg-cyan-500' : 'bg-[#ff007f]'
                      }`} />

                      <div>
                        {/* Type d'épreuve tag */}
                        <div className="flex items-center justify-between mb-6 relative z-10">
                          <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${
                            choice === 'truth'
                              ? 'text-cyan-300 border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                              : 'text-pink-300 border-pink-500/30 bg-pink-950/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                          }`}>
                            ⚡ {choice === 'truth' ? 'VÉRITÉ' : 'ACTION'}
                          </span>
                          <span className="text-slate-400 font-mono text-xs font-semibold">
                            {currentPlayer.name} • {GAME_DATA[selectedCategory].icon}
                          </span>
                        </div>

                        {/* TEXTE DU DÉFI */}
                        <div className="my-6 min-h-[120px] flex items-center justify-center relative z-10 select-all">
                          <p className="text-lg md:text-2xl font-black leading-relaxed text-slate-100 text-center drop-shadow px-2 tracking-tight italic">
                            {"\"" + (selectedChallenge?.text || "") + "\""}
                          </p>
                        </div>
                      </div>

                      {/* SECTION GAGE / PÉNALITÉ INTÉGRÉE SI "PASSER" CLIQUE */}
                      <AnimatePresence>
                        {showPenalty && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-black/90 border border-amber-500/40 p-5 rounded-2xl text-center mb-5 relative z-20 shadow-xl"
                          >
                            <h4 className="text-xs font-mono font-extrabold text-amber-400 flex items-center justify-center gap-1.5 uppercase mb-2 tracking-wider">
                              ⚠️ Gage de Substitution
                            </h4>
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-sm mx-auto mb-4 font-semibold">
                              {currentPenaltyText}
                            </p>
                            <button
                              type="button"
                              onClick={confirmPenaltyCompleted}
                              id="btn-confirm-penalty"
                              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-5 py-2 rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                            >
                              Gage effectué, tour suivant
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* CONTRÔLES SOUS LE DÉFI (Boutons réussi / Passer) */}
                      {!showPenalty && (
                        <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
                          {/* PASS / SKIP */}
                          <button
                            type="button"
                            onClick={handleChallengeSkip}
                            id="btn-challenge-skip"
                            className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-[#ff007f]/10 text-slate-300 hover:text-[#ff007f] hover:border-[#ff007f]/30 transition-all py-3 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                          >
                            <X className="w-4 h-4" />
                            Passer (Gage)
                          </button>

                          {/* RÉUSSI */}
                          <button
                            type="button"
                            onClick={handleChallengeSuccess}
                            id="btn-challenge-success"
                            className={`flex items-center justify-center gap-1.5 text-black transition-all py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg cursor-pointer select-none ${
                              choice === 'truth'
                                ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:scale-[1.02]'
                                : 'bg-pink-400 hover:bg-pink-300 shadow-pink-500/20 hover:shadow-pink-400/40 hover:scale-[1.02]'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Défi Réussi !
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BARRE INFÉRIEURE / LISTE COMPLÈTE DES SCORES RAPIDES */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mt-2 shadow-2xl">
                <h3 className="text-xs font-mono text-slate-400 flex items-center justify-between mb-4 tracking-wider uppercase">
                  <span className="flex items-center gap-2 font-bold">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Scores et Tour de Rôle
                  </span>
                  <span className="text-[10px] lowercase italic text-slate-500">cliquez sur défi réussi pour marquer un point</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {players.map((p, idx) => {
                    const isNext = (currentPlayerIndex + 1) % players.length === idx && choice !== null;
                    const isNow = currentPlayerIndex === idx;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-2xl transition-all border ${
                          isNow
                            ? 'bg-gradient-to-b from-[#7000ff]/15 to-transparent border-[#7000ff]/40 shadow-inner'
                            : isNext
                            ? 'bg-white/[0.02] border-white/5 opacity-70'
                            : 'bg-transparent border-transparent opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-extrabold truncate ${isNow ? 'text-white' : 'text-slate-300'}`}>
                            {isNow ? '▶ ' : ''}{p.name}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isNow ? 'bg-[#7000ff]/30 text-purple-200' : 'bg-white/5 text-slate-400'
                          }`}>
                            {p.score} pts
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#7000ff] to-[#ff007f] h-full transition-all duration-300" 
                            style={{ 
                              width: `${p.challengesCount > 0 ? (p.score / p.challengesCount) * 100 : 0}%` 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONTRÔLE ACTIONS GENERAUX */}
              <div className="flex items-center justify-between gap-3 mt-2 px-2">
                {/* Menu de retour */}
                <button
                  type="button"
                  onClick={resetToMainMenu}
                  id="btn-return-menu-reset"
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 text-xs transition-colors py-2 cursor-pointer font-bold uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {"Retour à l'accueil"}
                </button>

                {/* Indication utile du tour suivant */}
                <div className="hidden md:flex text-[11px] text-slate-500 italic font-mono uppercase tracking-wider">
                  Suivant : {players[(currentPlayerIndex + 1) % players.length]?.name}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER AVEC REGLES */}
      <footer className="relative z-10 w-full max-w-xl mt-4 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-1 font-mono uppercase tracking-widest font-bold">
          <span className="text-[#ff007f]">🎁 AMUSEMENT SANS LIMITES</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Veuillez respecter le consentement de chacun
          </span>
        </div>
      </footer>
    </div>
  );
}
