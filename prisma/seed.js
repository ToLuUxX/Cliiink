import { PrismaClient, Role, BorneStatus, PartnerCategory, ArticleCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { PrismaPg } from "@prisma/adapter-pg"
import pg from 'pg'
import { config } from "dotenv";
config()

// Initialisation via adapter PG avec un Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Début du seeding de la base de données...')

  // ============================================
  // CRÉATION DE L'UTILISATEUR ADMIN
  // ============================================
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@cliiink-reunion.re' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@cliiink-reunion.re',
      password: hashedPassword,
      name: 'Administrateur',
      role: Role.ADMIN,
    },
  })
  console.log('✅ Utilisateur admin créé:', admin.email)

  // ============================================
  // CRÉATION DES BORNES DE TRI
  // ============================================
  const bornes = [
    {
      name: 'Borne Saint-Denis Centre',
      address: '15 Rue Jean Chatel',
      city: 'Saint-Denis',
      zipCode: '97400',
      latitude: -20.8789,
      longitude: 55.4481,
      status: BorneStatus.ACTIVE,
      description: 'Borne située en centre-ville, accessible 24h/24',
    },
    {
      name: 'Borne Saint-Denis Barachois',
      address: 'Place du Barachois',
      city: 'Saint-Denis',
      zipCode: '97400',
      latitude: -20.8764,
      longitude: 55.4507,
      status: BorneStatus.ACTIVE,
      description: 'Face à la mer, près du jardin de l\'État',
    },
    {
      name: 'Borne Saint-Pierre Centre',
      address: '25 Rue des Bons Enfants',
      city: 'Saint-Pierre',
      zipCode: '97410',
      latitude: -21.3393,
      longitude: 55.4781,
      status: BorneStatus.ACTIVE,
      description: 'Centre-ville de Saint-Pierre',
    },
    {
      name: 'Borne Saint-Paul Marché',
      address: 'Rue du Marché',
      city: 'Saint-Paul',
      zipCode: '97460',
      latitude: -21.0107,
      longitude: 55.2701,
      status: BorneStatus.ACTIVE,
      description: 'Près du marché forain',
    },
    {
      name: 'Borne Le Port',
      address: '10 Avenue de la Commune de Paris',
      city: 'Le Port',
      zipCode: '97420',
      latitude: -20.9333,
      longitude: 55.2900,
      status: BorneStatus.MAINTENANCE,
      description: 'En maintenance jusqu\'au 15/12',
    },
    {
      name: 'Borne Saint-Louis',
      address: 'Place de la Mairie',
      city: 'Saint-Louis',
      zipCode: '97450',
      latitude: -21.2833,
      longitude: 55.4167,
      status: BorneStatus.ACTIVE,
      description: 'Devant la mairie',
    },
    {
      name: 'Borne Sainte-Marie',
      address: '5 Rue de la Rivière des Pluies',
      city: 'Sainte-Marie',
      zipCode: '97438',
      latitude: -20.8969,
      longitude: 55.5361,
      status: BorneStatus.ACTIVE,
      description: 'Proche du centre commercial',
    },
    {
      name: 'Borne Saint-André',
      address: 'Rue de la Gare',
      city: 'Saint-André',
      zipCode: '97440',
      latitude: -20.9631,
      longitude: 55.6497,
      status: BorneStatus.FULL,
      description: 'Centre-ville, collecte prévue',
    },
  ]

  for (const borne of bornes) {
    await prisma.borne.upsert({
      where: { id: borne.name.toLowerCase().replace(/\s+/g, '-') },
      update: borne,
      create: borne,
    })
  }
  console.log(`✅ ${bornes.length} bornes créées`)

  // ============================================
  // CRÉATION DES PARTENAIRES
  // ============================================
  const partners = [
    {
      name: 'Le Comptoir Créole',
      slug: 'le-comptoir-creole',
      description: 'Restaurant traditionnel réunionnais',
      longDescription: 'Découvrez les saveurs authentiques de La Réunion dans ce restaurant familial. Cari, rougail, et spécialités locales vous attendent.',
      category: PartnerCategory.RESTAURANT,
      address: '45 Rue Pasteur',
      city: 'Saint-Denis',
      zipCode: '97400',
      latitude: -20.8792,
      longitude: 55.4456,
      phone: '0262 21 45 67',
      email: 'contact@comptoircreole.re',
      advantages: ['10% de réduction sur l\'addition', 'Apéritif offert'],
      pointsRequired: 100,
      discount: '-10%',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Ti Punch Bar',
      slug: 'ti-punch-bar',
      description: 'Bar ambiance tropicale',
      longDescription: 'Le meilleur rhum arrangé de l\'île ! Ambiance conviviale et musicale tous les weekends.',
      category: PartnerCategory.BAR,
      address: '12 Front de Mer',
      city: 'Saint-Pierre',
      zipCode: '97410',
      latitude: -21.3401,
      longitude: 55.4789,
      phone: '0262 35 78 90',
      advantages: ['1 Ti Punch offert pour 200 points', 'Happy Hour prolongé'],
      pointsRequired: 200,
      discount: '1 boisson offerte',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Boutique Vanille Bourbon',
      slug: 'boutique-vanille-bourbon',
      description: 'Épicerie fine et produits locaux',
      longDescription: 'Vanille, épices, confitures artisanales et produits du terroir réunionnais.',
      category: PartnerCategory.BOUTIQUE,
      address: '8 Rue du Commerce',
      city: 'Saint-Paul',
      zipCode: '97460',
      latitude: -21.0098,
      longitude: 55.2715,
      phone: '0262 22 33 44',
      website: 'https://vanille-bourbon.re',
      advantages: ['15% sur les achats', 'Échantillon vanille offert'],
      pointsRequired: 150,
      discount: '-15%',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Café des Îles',
      slug: 'cafe-des-iles',
      description: 'Café torréfié localement',
      longDescription: 'Café Bourbon pointu et autres variétés torréfiées sur place. Espace dégustation.',
      category: PartnerCategory.CAFE,
      address: '3 Place de l\'Église',
      city: 'Sainte-Marie',
      zipCode: '97438',
      latitude: -20.8975,
      longitude: 55.5350,
      phone: '0262 53 21 00',
      advantages: ['Café offert', '10% sur les sachets de café'],
      pointsRequired: 50,
      discount: 'Café offert',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Super U Saint-Denis',
      slug: 'super-u-saint-denis',
      description: 'Supermarché partenaire',
      longDescription: 'Votre supermarché de proximité, engagé dans la démarche éco-responsable.',
      category: PartnerCategory.SUPERMARCHE,
      address: 'Centre Commercial Californie',
      city: 'Saint-Denis',
      zipCode: '97400',
      latitude: -20.8850,
      longitude: 55.4520,
      phone: '0262 20 10 20',
      advantages: ['Bons de réduction', '5% de remise immédiate'],
      pointsRequired: 300,
      discount: '5€ en bon d\'achat',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Spa Lagon Bleu',
      slug: 'spa-lagon-bleu',
      description: 'Centre de bien-être et spa',
      longDescription: 'Massages, soins du corps, hammam et sauna dans un cadre relaxant.',
      category: PartnerCategory.BEAUTE,
      address: '20 Route des Plages',
      city: 'Saint-Gilles',
      zipCode: '97434',
      latitude: -21.0667,
      longitude: 55.2167,
      phone: '0262 24 56 78',
      website: 'https://spa-lagonbleu.re',
      advantages: ['20% sur le premier soin', 'Accès hammam offert'],
      pointsRequired: 500,
      discount: '-20%',
      isActive: true,
      isFeatured: true,
    },
  ]

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { slug: partner.slug },
      update: partner,
      create: partner,
    })
  }
  console.log(`✅ ${partners.length} partenaires créés`)

  // ============================================
  // CRÉATION DES ARTICLES
  // ============================================
  const articles = [
    {
      title: 'Lancement de Cliiink à La Réunion !',
      slug: 'lancement-cliiink-reunion',
      excerpt: 'Le dispositif Cliiink arrive enfin sur notre île. Découvrez comment gagner des récompenses en triant vos bouteilles en verre.',
      content: `
# Cliiink débarque à La Réunion !

Nous sommes fiers d'annoncer le lancement officiel du dispositif **Cliiink** sur l'île de La Réunion.

## Comment ça marche ?

1. **Téléchargez l'application** Cliiink sur votre smartphone
2. **Déposez vos bouteilles en verre** dans une borne connectée
3. **Cumulez des points** à chaque dépôt
4. **Profitez de récompenses** chez nos partenaires

## Les premières bornes

Dès aujourd'hui, **8 bornes** sont disponibles dans les principales villes de l'île :
- Saint-Denis (2 bornes)
- Saint-Pierre
- Saint-Paul
- Le Port
- Saint-Louis
- Sainte-Marie
- Saint-André

## Un geste écologique récompensé

Chaque bouteille compte ! En moyenne, un foyer réunionnais consomme plus de **100 bouteilles en verre par an**. Avec Cliiink, ce geste de tri devient doublement gagnant : pour la planète et pour votre portefeuille.

*Rejoignez le mouvement et commencez à cumuler des points dès aujourd'hui !*
      `,
      category: ArticleCategory.ACTUALITE,
      tags: ['lancement', 'cliiink', 'réunion', 'tri'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-11-15'),
      authorId: admin.id,
    },
    {
      title: 'Nos partenaires commercants vous récompensent',
      slug: 'partenaires-commercants-recompenses',
      excerpt: 'Plus de 20 commerçants locaux vous offrent des réductions exclusives grâce à vos points Cliiink.',
      content: `
# Découvrez nos partenaires

Les commerçants réunionnais s'engagent avec Cliiink pour récompenser vos gestes éco-responsables.

## Des avantages exclusifs

Restaurants, bars, boutiques, supermarchés... Nos partenaires vous proposent :

- **Réductions** sur vos achats (de 5% à 20%)
- **Cadeaux** et produits offerts
- **Expériences** uniques (spa, loisirs...)

## Comment utiliser vos points ?

1. Consultez la liste des partenaires sur notre site ou l'application
2. Choisissez l'offre qui vous plaît
3. Présentez votre QR code en caisse
4. Profitez de votre récompense !

## Rejoignez notre réseau de partenaires

Vous êtes commerçant et souhaitez rejoindre l'aventure Cliiink ? [Contactez-nous](/contact) pour en savoir plus sur les conditions de partenariat.
      `,
      category: ArticleCategory.PARTENAIRES,
      tags: ['partenaires', 'récompenses', 'commerçants'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-11-20'),
      authorId: admin.id,
    },
    {
      title: '10 conseils pour bien trier le verre',
      slug: '10-conseils-bien-trier-verre',
      excerpt: 'Adoptez les bons réflexes pour un tri efficace et maximisez vos points Cliiink.',
      content: `
# 10 conseils pour bien trier le verre

Le tri du verre, c'est simple ! Suivez ces conseils pour devenir un pro du recyclage.

## ✅ Ce qui va dans la borne

1. **Bouteilles** de vin, bière, jus de fruits
2. **Pots** de confiture, moutarde
3. **Bocaux** en verre
4. **Flacons** de parfum (vidés)

## ❌ Ce qu'il faut éviter

5. **Vaisselle** en verre (assiettes, verres)
6. **Miroirs** et vitres
7. **Ampoules** (déchetterie)
8. **Céramique** et porcelaine

## 💡 Astuces bonus

9. **Inutile de rincer** : un simple égouttage suffit
10. **Retirez les bouchons** en métal ou plastique

## Le saviez-vous ?

Le verre est recyclable **à l'infini** ! Une bouteille recyclée peut redevenir une bouteille en seulement 30 jours.

*Avec Cliiink, chaque geste compte et rapporte !*
      `,
      category: ArticleCategory.CONSEILS,
      tags: ['conseils', 'tri', 'verre', 'recyclage'],
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2024-11-25'),
      authorId: admin.id,
    },
    {
      title: 'Résultats du premier mois : 5 tonnes de verre collectées !',
      slug: 'resultats-premier-mois-5-tonnes',
      excerpt: 'Un mois après le lancement, les Réunionnais ont déjà adopté le réflexe Cliiink.',
      content: `
# Bilan du premier mois

Un mois après le lancement, les chiffres sont encourageants !

## Les résultats en chiffres

- **5 tonnes** de verre collectées
- **2 500** utilisateurs inscrits
- **15 000** dépôts réalisés
- **750 000** points distribués

## Les champions du tri

Saint-Denis arrive en tête avec **40%** des dépôts, suivi de Saint-Pierre (25%) et Saint-Paul (15%).

## Objectifs pour les prochains mois

- Installer **10 nouvelles bornes** d'ici mars 2025
- Atteindre **10 000 utilisateurs**
- Collecter **50 tonnes** de verre en 6 mois

## Merci !

Un grand merci à tous les participants et à nos partenaires pour leur engagement. Ensemble, faisons de La Réunion un modèle d'économie circulaire !
      `,
      category: ArticleCategory.RESULTATS,
      tags: ['résultats', 'statistiques', 'bilan'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-01'),
      authorId: admin.id,
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    })
  }
  console.log(`✅ ${articles.length} articles créés`)

  // ============================================
  // CONFIGURATION DU SITE
  // ============================================
  const configs = [
    {
      key: 'site_title',
      value: 'Cliiink Réunion - Triez, Gagnez, Préservez',
      description: 'Titre du site',
    },
    {
      key: 'site_description',
      value: 'Cliiink Réunion : le dispositif de tri du verre qui vous récompense. Trouvez une borne, déposez vos bouteilles et gagnez des avantages chez nos partenaires.',
      description: 'Description SEO du site',
    },
    {
      key: 'hero_title',
      value: 'Triez votre verre, gagnez des récompenses',
      description: 'Titre du hero banner',
    },
    {
      key: 'hero_subtitle',
      value: 'Avec Cliiink, chaque bouteille déposée vous rapporte des points échangeables chez nos partenaires réunionnais.',
      description: 'Sous-titre du hero banner',
    },
    {
      key: 'total_glass_collected',
      value: '5.2',
      description: 'Total de verre collecté en tonnes',
    },
    {
      key: 'total_users',
      value: '2847',
      description: 'Nombre total d\'utilisateurs',
    },
    {
      key: 'total_partners',
      value: '24',
      description: 'Nombre de partenaires',
    },
  ]

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }
  console.log(`✅ Configuration du site initialisée`)

  console.log('🎉 Seeding terminé avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
