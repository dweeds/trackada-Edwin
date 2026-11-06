
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { homedir } from "os"

// Charger et parser track.json
const texte = readFileSync("track.json", "utf-8")
const track = JSON.parse(texte)

// Construire le chemin vers ~/ada-tech/bloc1/projets
const dossierProjets = join(homedir(), "ada-tech", "bloc1", "projets")

// Vérifier que le dossier principal existe
if (!existsSync(dossierProjets)) {
    console.log("❌ Dossier introuvable : " + dossierProjets)
    process.exit(1)
} else {
    console.log("✅ Dossier des projets trouvé : " + dossierProjets)
}

// Récupérer les projets
const projects = track.projects

let nombreCorrects = 0

// Vérifier chaque projet
projects.forEach((p) => {

    console.log("\n--- Projet : " + p.name + " ---")

    // 1. Vérifier que le dossier existe
    const cheminProjet = join(dossierProjets, p.name)
    const lesdossier = existsSync(cheminProjet)

    if (!lesdossier) {
        console.log("❌ Dossier du projet absent : " + p.name)
    } else {
        console.log("✅ Dossier du projet présent : " + p.name)
    }

    // 2. Vérifier que Git est initialisé
    const gitOk = existsSync(join(cheminProjet, ".git"))

    if (!gitOk) {
        console.log("❌ Git non initialisé : " + p.name)
    } else {
        console.log("✅ Git initialisé : " + p.name)
    }

    // 3. Vérifier les fichiers requis
    let tousLesFichiersPresents = true

    p.required.forEach((req) => {
        const chemin = join(cheminProjet, req)

        if (existsSync(chemin)) {
            console.log("✅ Fichier présent : " + req)
        } else {
            tousLesFichiersPresents = false
            console.log("❌ Fichier manquant : " + req)
        }
    })

    // Compter les projets entièrement corrects
    if (lesdossier && gitOk && tousLesFichiersPresents) {
        nombreCorrects++
    }
})

// Calculer et afficher le pourcentage
const pourcentage = projects.length > 0
    ? Math.round(nombreCorrects / projects.length * 100)
    : 0

console.log("\n" + nombreCorrects + " projet(s) correctement initialisé(s)")
console.log(pourcentage + " % des projets sont initialisés correctement")
