# Développer avec ADF

## Prérequis

Cette application utilise les dernières mises à jour Alfresco:

- [Alfresco ADF (2.6.0)](https://community.alfresco.com/community/application-development-framework/pages/get-started)
- [Alfresco Content Services (5.2.4)](https://www.alfresco.com/platform/content-services-ecm)


<p class="warning">
Il faut aussi installer <a href="https://nodejs.org/en/" target="_blank">node.js</a> (LTS) pour pouvoir l'exécuter localement à partir du code source.
</p>

La dernière version d'Alfresco est nécessaire car l'application utilise les derniers [REST APIs](https://docs.alfresco.com/5.2/pra/1/topics/pra-welcome.html).

## Build à partir du code source

ADF-Notepad est basée sur [Angular CLI](https://cli.angular.io).

### Preréquis pour build

- [Node.js](https://nodejs.org/en/) LTS
- [Angular CLI](https://cli.angular.io/) 7.0.2

### Clone et exécution

Utilisez les commandes suivantes pour cloner le projet, installer les dépendances et l'exécuter.

```sh
git clone https://github.com/nbarithel/adf-notepad.git
cd adf-notepad
npm install
npm start
```

L'application s'exécute sur le port `4200` par défaut et s'ouvre automatiquement dans le navigateur défini par défaut une fois la compilation du projet finie.

### Exécution des tests unitaires

La commande `npm test` permet d'exécuter les tests unitaires via [Karma](https://karma-runner.github.io/latest/index.html).

## Techniques de développement

### Modifier le style de l'application

#### View Encapsulation

Par défaut, on peut modifier tous les éléments (composants/class/id/…) présents dans le template du composant grâce au ‘*****.component.scss’.
Les changements de style dans ce fichier ne vont pas affecter les éléments qui ne sont pas directement écrit dans le template HTML.

<p class="warning">
  Problème : Comment modifier le style de ces éléments inaccessibles ?
</p>

Exemple : Mat-Dialog/Mat-Toolbar/Éléments dans le template d’un composant ADF.

#### Global Styling

Pour résoudre ceci, Angular a mis en place un système de global styling avec le ‘custom-style.scss’.
On peut ainsi accéder à tous les éléments.<br/>
Par défaut, une propriété définie dans le global stylesheet prévaut si celle ci est déjà définie ailleurs (overriding).<br/>
En ajoutant un style dans un global stylesheet, il faut bien faire attention à scope les éléments correctement pour seulement appliquer le style sur le bon élément. (ex: deux mat-toolbars différentes). <br/>

<p class="tip">
Il est aussi possible de désactiver la ‘view encapsulation’ du composant pour accéder à tous les éléments et ainsi de modifier le style à partir du ‘***.component.scss’ mais ce n'est pas conseillé.
</p>

#### Dans ADF-Notepad

Pour créer ce style personnalisé dans ADF-Notepad, j'ai utilisé le SCSS et procédé ainsi :

- Ajout d’un dossier `src/app/ui` contenant un dossier overrides et un fichier `application.scss`
- Dans le dossier overrides :
    - Création des stylesheets globaux (theme.scss).
    - Chaque stylesheet correspond à un composant.
    - Utilisation du `@mixin { }` dans lequel on définit les règles de style. C'est comme définir une fonction.
- Dans le fichier application.scss :
    - Import des stylesheets globaux des composants.
    - Utilisation du `@include`, sert à instancier les @mixin (analogie fonction/appel de fonction).
- Ajout d' `@import 'app/ui/application;` dans le custom-style.scss pour rendre les overrides effectifs.

### Les template reference variables

Une variable de référence de template est une variable qui fait référence à un élément DOM dans un template.
Elle peut être une référence à un composant, une directive ou un web component.
<br/>
Cela peut faciliter la transmission de données entre des composants présents dans un même template en évitant l’utilisation de @ViewChild ou d’un @Output (eventEmitter).
<br/>
Pour déclarer une telle variable, il faut utiliser ‘#’ devant le nom de la variable écrite dans la balise HTML de l’élément.
On peut ensuite utiliser cette variable n’importe où dans le template.


Exemple : Affichage du nombre d’annexes dans l’onglet ‘annexes’ de l’info-drawer :

```html
<app-info-drawer-tab icon="link" label="{{'DOCUMENT.CONTENT_VIEW.LINKDOC' | translate}}" badge="{{ appendix.appendixNodesCount }}">
    <mat-card></mat-card>
        <mat-card-content>
            <app-appendix [node]="node" (success)="documentList.reload()" #appendix></app-appendix>
        </mat-card-content>
    </mat-card>
</app-info-drawer-tab>
```

### Implémenter un composant externe

Exemple du remplacement de l'éditeur de texte Covalent par Tiny MCE.

- Installation du composant :
    - `$ npm install @tinymce/tinymce-angular`
- Import du module dans l’app.modules.ts et dans le composant Text-Editor :
    - `import { EditorModule } from '@tinymce/tinymce-angular';`
- Ajout du module dans la partie `import` du @NgModule du fichier `“App.module.ts”`
- Ajout dans le template du composant :
    - ```html
     <editor apiKey="test" [init]="{plugins: 'link'}"></editor>
      ```
- Modification de l’apiKey (donnée au moment de la création du compte tinyMce), et ajout de fonctionnalités en modifiant l’input [init].
- Enlever l'ancien éditeur de texte.

On peut ensuite modifier le style et les fonctionnalités du nouvel éditeur de texte pour répondre aux besoins de l'application.
Pour cela voir la documentation de [Tiny MCE](https://www.tiny.cloud/docs/).


### RxJS et subscriptions

#### RxJS dans angular

La programmation réactive dans Angular permet la propagation asynchrone des données et des changements dans le DOM notamment par le biais des services qui font le lien entre les composants qui ne sont pas directement liés.

<p class="tip">
  Pourquoi utiliser RxJS ?
</p>

Mise en situation : Les composants fils d’un composant router ne peuvent pas directement communiquer avec ce dernier par le biais d’Ouputs.

Les services permettent une telle communication mais sans RxJS, le flux de données se fait de manière synchrone ainsi, il faut attendre que le composant parent se recharge (avec les lifecycle hooks Angular de type Check ou change) ou soit réinitialisé pour que les données soient transmises.

<p class="warning">
  Problème : L’utilisation de check / changes dans les composants ralentit fortement l’application car se déclenche souvent et le ngOnChange est seulement appelé lorsqu’un “input” change ou lors de l’initialisation du composant (avant le ngOnInit). C’est là que la programmation réactive intervient.
</p>

#### Subscription

Pour pouvoir mettre en place ce flux de données asynchrone, on utilise les [observables RxJS](https://angular.io/guide/observables).

En s’abonnant à un observable via la méthode subscribe() entre autres, on peut accéder aux données qu’il renvoie et les traiter de façon asynchrone d’un composant à un autre via un service. Cela permet d’éviter l’utilisation de ‘check’ très contraignant.

<p class="warning">
Un observable ne renvoie rien du moment qu’un client ne s’y abonne pas.
</p>

#### Gestion des subscriptions

Dans Angular, si un composant/service doit changer selon la valeur d’un observable alors il est judicieux de subscribe lors de l’initialisation du composant dans le ngOnInit.

<p class="warning">
Se réabonner à un observable est inutile et va seulement doubler les calculs.
</p>

Lors de la destruction d’un composant, si le subscribe n’a pas renvoyé d’erreur ou la méthode complete de l’observable alors l’abonnement sera toujours actif et causera des “fuites de mémoires” dans le cas où l’observable renverra encore des données et que celles-ci seront traitées provoquant parfois des bugs/latences dans l’application.
Lorsqu’on en a fini avec l’observable, il faut donc se désabonner de celui ci (méthode .unsubscribe() ) notamment lors de la destruction du composant (ngOnDestroy).

Dans ADF-Notepad et ACA, pour gérer les multiples subscriptions d’un composant nous avons procédé ainsi :

- Création d’un tableau de subscription en tant qu’attribut du composant.
- Lors de son initialisation (onInit), on s’abonne avec la méthode subscribe à chaque observable dont on veut récupérer les données et on ajoute chaque abonnement dans le tableau de subscription (méthode push() ou concat()).
- Lors de sa destruction (onDestroy), on crée une boucle qui se désabonne de chaque observable du tableau subscription évitant ainsi les “fuites de mémoires”.

### NgDoCheck

Comme énoncé précédemment les cycles de vie ‘check’ angular et spécialement le ngDoCheck sont très contraignants à utiliser.

En effet, ce sont des méthodes qui vont s’exécuter extrêmement souvent et qui vont alors facilement poser des problèmes de performances notamment dans des applications assez volumineuses.
On recommande de ne pas les utiliser (sauf onPush Strategy).

<p class="tip">
L’utilisation de RxJS et des [observables](https://angular.io/guide/observables-in-angular ) permet de traiter des données de manières asynchrones et ainsi d’éviter de vérifier les changements du composant sans arrêt.
</p>

exemple : Router.events (app-layout), Output et EventEmitter, Async Pipe, ActivatedRoute, Dom Events (click) ...

### Subjects

Il existe un type d'Observable qui permet non seulement de réagir à de nouvelles informations, mais également d'en émettre. <br/>
C’est le cas des ‘Subjects’ qui agissent à la fois en tant qu’Observer et Observable.
Par exemple une variable dans un service, qui peut être modifiée depuis plusieurs components ET qui fera réagir tous les composants qui y sont liés en même temps.

Cas ADF-Notepad : Variables subjects du service NoteService modifiées et lues par les composants DocumentList et app-layout (routeur).
