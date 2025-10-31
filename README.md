# Meuble Manager

## Gestion de projet

Le suivi du projet (Trello) se trouve sur GitHub Projects : [https://github.com/users/bynawrp/projects/4](https://github.com/users/bynawrp/projects/4)

## Documentation technique

Les documents techniques se trouvent dans le dossier `docs/`.

## Installation

### Étapes

1. **Cloner le projet**
```bash
cd meubleManager
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**

Vous pouvez utiliser le fichier `.env.example` comme modèle. Copiez-le et renommez-le en `.env` :

**Linux/Mac :**
```bash
cp .env.example .env
```

**Windows :**
```powershell
Copy-Item .env.example .env
```

4. **Initialiser la base de données**
```bash
npm run seed
```

Cette commande crée :
- 1 utilisateur admin (username: `admin`, password: `admin123`)
- 3 fournisseurs (BBois, MetaLo, pPlastique)
- 2 catégories (Armoire, Etagère)
- 7 matériaux (Frêne, Chêne, Noyer, Acier, Inox, Aluminium, Plastique)
- 6 meubles d'exemple

5. **Démarrer le serveur**
```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`
