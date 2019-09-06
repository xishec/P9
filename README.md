# Log2990
Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

# Important
Les commandes commençant par `npm` ou `yarn` devront être exécutées dans les dossiers `client` et `server`.

## Installation des dépendances de l'application
- Installer `npm` (non recommandé) ou `yarn` (très recommandé). `npm` viens avec `Node` que vous pouvez télecharger [ici](https://nodejs.org/en/download/)

- Lancer `npm install` ou `yarn`

## Développement de l'application
Pour lancer l'application, il suffit d'exécuter: `npm start` ou `yarn start`. Vous devez lancer cette commande dans le dossier `client` et `server`

Pour le client : 
    Une page menant vers `http://localhost:4200/` s'ouvrira automatiquement.

Pour le serveur :
    Votre serveur est accessible sur `http://localhost:3000`. Par défaut, votre client fait une requête `GET` vers le serveur pour obtenir un message.


L'application se relancera automatiquement si vous modifiez le code source de celle-ci.

## Génération de composants du client
Pour créer de nouveaux composants, nous vous recommandons l'utilisation d'angular CLI. Il suffit d'exécuter `ng generate component component-name` pour créer un nouveau composant. 

Il est aussi possible de générer des directives, pipes, services, guards, interfaces, enums, muodules, classes, avec cette commande `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Exécution des tests unitaires
- Exécuter `npm run test` ou `yarn test` pour lancer les tests unitaires.

- Exécuter `npm run coverage` ou `yarn coverage` pour générer un rapport de couverture de code.

## Exécution de TSLint
- Exécuter `npm run lint` pour lancer TSLint.

- Exécuter `npm run lint -- --fix` ou `yarn lint --fix` pour régler automatiquement certaines erreurs de lint.

## Aide supplémentaire
Pour obtenir de l'aide supplémentaire sur Angular CLI, utilisez `ng help` ou [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Pour la documentation d'Angular, vous pouvez la trouver [ici](https://angular.io/docs)

Pour la documentation d'Express, vous pouvez la trouver [ici](https://expressjs.com/en/4x/api.html)

Pour obtenir de l'aide supplémentaire sur les tests avec Angular, utilisez [Angular Testing](https://angular.io/guide/testing)


# Standards de programmations
Cette section présente les différents standards de programmations que vous devez respecter lors de la réalisation de ce projet et qui seront utilisés pour la correction de l'assurance qualité de votre projet.

Référez vous au fichier `tslint.json` dans le dossier `common` pour les règles spécifiques.

## Format
Une accolade fermante occupe sa propre ligne de code, sauf dans le cas d'une if/else, où l'accolade fermante du if se trouve sur la ligne du else.

Une ligne de code devrait normalement avoir entre 45 et 80 caractères.

Une ligne de code ne devrait JAMAIS dépasser les 140 caractères.

## Conventions de nommage
Utilisez le ALL_CAPS pour les constantes.

Utilisez le PascalCase pour les noms de types et les valeurs d'énumérations.

Utilisez le camelCase pour les noms de fonctions, de propriétés et de variables.

Utilisez le kebab-case pour les noms de balises des composants Angular.

Évitez les abbréviations dans les noms de variables ou de fonctions.

Un tableau/list/dictionnaire devrait avoir un nom indiquant qu'il contient plusieurs objets, par exemple "Cars".

On évite de mettre le type de l'objet dans le noms, par exemple on préfère "Cars" à "ListOfCars" lorsqu'on déclare une liste.

Un objet ne devrait pas avoir un nom qui porte à croire qu'il s'agit d'un tableau.

Vous devez coder dans une langue et une seule. Nous vous recommandons d'écrire votre code en anglais, mais vous êtes libres de coder en français.

## Autres standards
N'utilisez jamais var. Utilisez let et const.

N'utilisez jamais any, que ce soit implicitement ou explicitement.

N'utilisez pas le mot-clé function, utilisez les fonctions anonymes: `() => {...}`.

Déclarez tous les types de retour des fonctions (incluant void).

Évitez les fonctions qui ont plus d'une responsabilité.

N'utilisez pas de nombres magiques.

N'utilisez pas de chaînes de caractères magiques. Créez vos propres constantes avec des noms explicites.

Une fonction devrait avoir 3 paramètres ou moins.

Évitez la duplication de code.

Séparez votre code Typescript du CSS et du HTML. Générez vos component avec Angular CLI qui le fait pour vous

## Git
Une seule fonctionnalité par branche.

Une branche fonctionnalité devrait se nommer `feature/nom-du-feature`.

Une branche correction de bogue devrait se nommer `hotfix/nom-du-bug`.

Les messages de commit doivent être concis et significatifs. Ne mettez pas des messages trop long ou trop courts. On devrait être capable de comprendre ce que le commit fait sans lire les changements.

Vous devez garder le même courriel, peu importe l'ordinateur que vous utilisez. Il ne devrait donc pas y avoir plus de 6 contributeurs dans votre repo. Un script d'extraction des métriques dans Git vous est fourni sur Moodle.

Nous vous recommandons fortement de suivre le [Github-Flow](https://guides.github.com/introduction/flow/). [Lecture suggérée](http://scottchacon.com/2011/08/31/github-flow.html)

Si vous n'êtes pas familiers avec Git et le fonctionnement des branches, nous vous recommandons fortement d'explorer [ce guide intéractif](https://onlywei.github.io/explain-git-with-d3/).


## Lectures suggérées
[AntiPatterns](https://sourcemaking.com/antipatterns) (plus spécifiquement [Software Development AntiPatterns](https://sourcemaking.com/antipatterns/software-development-antipatterns))

[Building your first Angular App](https://scrimba.com/g/gyourfirstangularapp) 


# Cadriciel

Nous vous avons fourni plusieurs pièces de code.

## Général

Votre serveur expose 2 routes :

`/api/index` renvoie un message défini selon l'interface `message` dans `common/message.ts`

`/api/date` renvoie la l'heure et la date d'aujourd'hui en faisant un appel à une API externe (worldclockapi)
