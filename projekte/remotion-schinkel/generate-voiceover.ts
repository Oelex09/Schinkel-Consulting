/**
 * Generates German voiceover audio files using ElevenLabs TTS.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key node --experimental-strip-types generate-voiceover.ts
 *
 * After generation, set VOICEOVER_ENABLED = true in SchinkelVideo.tsx
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error(
    "\n❌  ELEVENLABS_API_KEY not set.\n" +
      "   Run: ELEVENLABS_API_KEY=your_key node --experimental-strip-types generate-voiceover.ts\n" +
      "   Get your key at: https://elevenlabs.io\n"
  );
  process.exit(1);
}

/**
 * ElevenLabs Voice IDs (male, German-capable):
 *   - "onwK4e9ZLuTAKqWW03F9"  → Daniel  (authoritative, deep)
 *   - "pNInz6obpgDQGcFmaJgB"  → Adam    (confident, clear)
 *   - "N2lVS1w4EtoT3dr4eOWO"  → Callum  (calm authority)
 *
 * Recommendation for Handwerker-Ansprache: Daniel
 */
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel – tief, autoritär, vertrauenswürdig
const MODEL_ID = "eleven_multilingual_v2";

interface Scene {
  id: string;
  text: string;
}

const SCENES: Scene[] = [
  {
    id: "scene-01",
    text: "Handwerker, die heute noch alles manuell erledigen, werden morgen den Anschluss verlieren.",
  },
  {
    id: "scene-02",
    text: "Als Chef läuft deine Baustelle. Aber im Büro verlierst du täglich Stunden – mit Bautagebüchern, Protokollen, E-Mails und Rechnungen. Das muss nicht so sein.",
  },
  {
    id: "scene-03",
    text: "Die erfolgreichsten Handwerksbetriebe nutzen es bereits. Durch Workflow-Automatisierung sparen sie bis zu vierzig Prozent ihrer Bürozeit – maßgeschneidert für Handwerk und Bau.",
  },
  {
    id: "scene-04",
    text: "Hi, ich bin Alexander Schinkel. Maurer- und Stahlbetonbaumeister, Bautechniker und Kaufmann mit dreißig Jahren Praxiserfahrung im Bauhandwerk. Mit Schinkel Consulting bringe ich intelligente Automatisierung in deinen Betrieb. Praxisnah. Ohne IT-Kenntnisse. Sofort wirksam.",
  },
  {
    id: "scene-05",
    text: "Wir automatisieren dein digitales Bautagebuch – direkt vom Smartphone, ohne Doppelaufwand. Besprechungsprotokolle entstehen automatisch aus Sprachaufzeichnungen – fertig formatiert, während du die Baustelle verlässt. Deine E-Mails werden sortiert, priorisiert und beantwortet. Angebote, Rechnungen, Subunternehmer – automatisiert und revisionssicher.",
  },
  {
    id: "scene-06",
    text: "Das Ergebnis: Bis zu vierzig Prozent weniger Büroaufwand. Keine verlorenen Informationen mehr. Schnellere Reaktionszeiten gegenüber Kunden. Mehr Kapazität für Wachstum und Akquise. Sofort einsetzbar – innerhalb von vier bis acht Wochen. Garantiert.",
  },
  {
    id: "scene-07",
    text: "Klingt gut? Dann sichere dir jetzt dein kostenloses Erstgespräch. Unverbindlich, dreißig Minuten, konkrete Ergebnisse. Auf alexanderschinkel.com.",
  },
];

async function generateAudio(scene: Scene, outputPath: string): Promise<void> {
  console.log(`  Generating ${scene.id}...`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.78,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${error}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`  ✅  ${scene.id}.mp3 (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  const outputDir = join(process.cwd(), "public", "voiceover");

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log("\n🎙️  Schinkel Consulting – Voiceover Generation");
  console.log(`   Voice: Daniel (${VOICE_ID})`);
  console.log(`   Model: ${MODEL_ID}`);
  console.log(`   Output: ${outputDir}\n`);

  for (const scene of SCENES) {
    const outputPath = join(outputDir, `${scene.id}.mp3`);
    await generateAudio(scene, outputPath);
  }

  console.log("\n✨  All voiceover files generated!");
  console.log(
    '\n   Next step: Set VOICEOVER_ENABLED = true in src/SchinkelVideo.tsx\n'
  );
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message);
  process.exit(1);
});
