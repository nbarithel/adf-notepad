# ADF-Notepad

ADF-Notepad est une application de gestion de notes (bloc-notes) et un exemple d'application construit grâce au framework Alfresco ADF [(Application Development Framework)](https://github.com/Alfresco/alfresco-ng2-components).

## Compte Rendu projet

### Rappel des buts et objectifs

#### Buts
- Se préparer pour l’avenir des développements avec Alfresco.
- Familiarisation avec le framework ADF.
- Se faire une idée sur la difficulté d’utilisation du framework ADF.
- Communiquer sur le fait que Atol CD travaille sur ADF.

#### Objectifs
- Application de démonstration ADF (code source sur GitHub) pour fin Septembre 2018.
- Documenter l’ensemble des étapes nécessaires et analysées pour un transfert au reste de l’équipe.
- Comparer la complexité entre partir d’ACA ou “from scratch”.

### ADF-Notepad : Application "From Scratch"

#### Tâches effectuées

- Création de l’application ADF-Notepad à partir de Yeoman et création de son projet GIT.
- Développement et documentation de la création d’une application démo ADF “from scratch”.

####  Fonctionnalités ajoutées

- Thème Picker/Theming.
- Internationalisation.
- Style custom.
- Routing (avec paramètres).
- Fonctionnement en site (reprise de la navigation arborescente de l’espace document appliqué à un site).
- Page principale avec :
    - Logo + titre.
    - Sélection thème / langue.
    - Bouton “mon compte”.
    - Bouton de déconnexion.
    - Affichage d’une datatable custom :
    - Filtrage du contenu affichable et importable dans la liste de fichier.
    - Colonnes personnalisées.
    - Affichage des tags.
    - Drag & drop.
    - Pagination.
    - BreadCrumb + Search Input.
    - Actions de base et personnalisées sur le contenu.
- Menu personnalisé :
    - Choix du site.
    - Possibilité de créer/importer une nouvelle note/créer un site.
    - Possibilité de l’afficher ou non.
- Barre de resize à la souris entre la datatable et l’affichage d’informations de la note.
- Interface d’informations des notes sur la droite de l’application :
    - Quand aucune note sélectionnée :
        - Affichage d’un onglet avec bouton : ”Création d’une nouvelle note”.
        - Affichage d’un message et du nombre de notes enregistrées dans le répertoire courant.
    - Quand création d’une nouvelle note :
        - Saisie du nom de la note.
        - WYSIWYG pour la saisie de la note.
        - Bouton enregistrement de note (actif si les deux champs précédent remplis).
    - Quand note sélectionnée :
        - Affichage de 5 onglets :
            - Note => Édition de la note, bouton enregistrement, versionning, rename.
            - Propriétés => Métadonnées et composant social.
            - Versions => Affichage des versions de la note et actions sur celles-ci.
            - Annexes => Affichage, upload et lien d’annexes.
            - Commentaire => Ajout et affichage des commentaires et tags
        - Onglets personnalisées, modification du composant pour créer un badge permettant d’afficher le nombre de versions, d’annexes et de commentaires dans la tête de l’onglet.
- Notifications, pop-up, tooltips.
- Corbeille personnalisée (Possibilité de suppression définitive ou restaurer les notes).
- Authentification obligatoire.
- Retrait de composants lors du build en production.
- Intégration du flip-book (pour vérifier son fonctionnement dans ADF 2.5 puis retrait)
- Tests, coverage.
- Recherche de note avec tri et affichage des résultats, et affichage du répertoire d’une note recherchée.

####  Difficultés principales

- Création de tests adaptés au composant.
- Utilisation du Rxjs, observable/promise/subject.
- Ne pas utiliser Check / OnChanges
- Recréer la recherche de notes

## Liens utiles

- [GitHub ADF-Notepad](https://github.com/nbarithel/adf-notepad)

- [GitHub Alfresco Content Application](https://github.com/Alfresco/alfresco-content-app)

- [Documentation Alfresco ADF](https://alfresco.github.io/adf-component-catalog/index.html)

- [Documentation Alfresco Content Application](https://github.com/Alfresco/alfresco-content-app/tree/master/docs)

- [Documentation Angular](https://angular.io/docs)

- [Alfresco Community](https://community.alfresco.com/community/application-development-framework)