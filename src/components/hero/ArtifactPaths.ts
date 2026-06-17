export interface ArtifactDef {
  id: string;
  label: string;
  /** SVG path data for the silhouette (viewBox 0 0 100 100) */
  silhouettePath: string;
  circlePath: string;
  initialX: number; // vw
  initialY: number; // vh
  size: number;     // px
  floatDuration: number;
  floatAmplitude: number;
  scaleDuration: number;   // breathing period (seconds)
  scaleAmplitude: number;  // ± scale (e.g. 0.10 = ±10%)
  entranceDelay: number;
}

const circlePath = (r = 44) =>
  `M 50,${50 - r} A ${r},${r} 0 1,1 ${50 - 0.001},${50 - r} Z`;

/** Korean artifact silhouette paths — viewBox 0 0 100 100 */
const silhouettes = {
  // 달항아리: Near-circular moon jar with small foot and lip
  "moon-jar": `
    M 50,6 C 74,6 92,24 92,50 C 92,76 74,93 50,93
    C 26,93 8,76 8,50 C 8,24 26,6 50,6 Z
    M 44,93 L 43,97 C 43,99 57,99 57,97 L 56,93 Z
  `,
  // 청자 주자: Ewer — pear body, spout right, loop handle left
  "ewer": `
    M 50,8 C 65,8 78,18 82,34
    C 88,34 96,38 96,46 C 96,54 88,58 82,58
    C 78,73 70,86 55,91 L 55,95 C 55,98 45,98 45,95 L 45,91
    C 30,86 22,73 18,58
    C 12,58 4,54 4,46 C 4,38 12,34 18,34
    C 22,18 35,8 50,8 Z
  `,
  // 보살좌상: Bodhisattva — oval head, draped body, lotus base
  "bodhisattva": `
    M 50,5 C 58,5 64,11 64,20 C 64,29 58,35 50,35
    C 42,35 36,29 36,20 C 36,11 42,5 50,5 Z
    M 38,35 C 24,40 15,52 14,66 C 13,80 22,90 38,93
    C 28,94 22,97 18,100 L 82,100 C 78,97 72,94 62,93
    C 78,90 87,80 86,66 C 85,52 76,40 62,35 Z
  `,
  // 청자 완: Wide shallow celadon bowl
  "bowl": `
    M 10,40 C 14,28 30,20 50,20 C 70,20 86,28 90,40
    C 93,50 88,70 80,76 L 62,80 L 38,80 L 20,76
    C 12,70 7,50 10,40 Z
    M 38,80 L 36,88 C 36,92 64,92 64,88 L 62,80 Z
    M 34,88 L 34,93 C 34,96 66,96 66,93 L 66,88 Z
  `,
  // 병: Tall bottle vase — narrow neck, wide belly
  "vase": `
    M 44,5 C 48,3 52,3 56,5
    C 62,5 67,10 67,17 C 67,24 62,29 55,31
    L 58,50 C 66,54 76,64 76,78 C 76,90 64,97 50,97
    C 36,97 24,90 24,78 C 24,64 34,54 42,50
    L 45,31 C 38,29 33,24 33,17 C 33,10 38,5 44,5 Z
  `,
  // 청동 거울: Round bronze mirror with 8-lobed decorative border
  "mirror": `
    M 50,4 L 56,8 C 64,4 74,6 80,12 L 82,6
    L 88,12 L 84,18 C 90,26 92,36 92,46 L 98,48
    L 98,52 L 92,54 C 90,64 86,74 80,80 L 84,86
    L 78,92 L 74,86 C 66,92 58,94 50,94
    C 42,94 34,92 26,86 L 22,92 L 16,86 L 20,80
    C 14,74 10,64 8,54 L 2,52 L 2,48 L 8,46
    C 8,36 10,26 16,18 L 12,12 L 18,6 L 20,12
    C 26,6 36,4 44,8 Z
    M 50,20 C 64,20 78,33 78,48 C 78,63 64,78 50,78
    C 36,78 22,63 22,48 C 22,33 36,20 50,20 Z
  `,
};

export const ARTIFACTS: ArtifactDef[] = [
  // 1. Moon Jar — large, left / overlaps "A" in Art
  {
    id: "moon-jar",
    label: "Moon Jar",
    silhouettePath: silhouettes["moon-jar"],
    size: 155,
    initialX: 12,
    initialY: 42,
    floatDuration: 11,
    floatAmplitude: 48,
    scaleDuration: 8,
    scaleAmplitude: 0.10,
    entranceDelay: 0.1,
    circlePath: circlePath(),
  },
  // 2. Bottle Vase — medium, upper right / close to "f" in "of"
  {
    id: "vase",
    label: "Bottle Vase",
    silhouettePath: silhouettes["vase"],
    size: 116,
    initialX: 72,
    initialY: 17,
    floatDuration: 9,
    floatAmplitude: 42,
    scaleDuration: 10,
    scaleAmplitude: 0.09,
    entranceDelay: 0.25,
    circlePath: circlePath(),
  },
  // 3. Bowl — small, right / near "a" in "Korea"
  {
    id: "bowl",
    label: "Celadon Bowl",
    silhouettePath: silhouettes["bowl"],
    size: 52,
    initialX: 80,
    initialY: 38,
    floatDuration: 7,
    floatAmplitude: 36,
    scaleDuration: 6.5,
    scaleAmplitude: 0.12,
    entranceDelay: 0.4,
    circlePath: circlePath(),
  },
  // 4. Ewer — small-medium, bottom left / near "K"
  {
    id: "ewer",
    label: "Celadon Ewer",
    silhouettePath: silhouettes["ewer"],
    size: 64,
    initialX: 23,
    initialY: 74,
    floatDuration: 12,
    floatAmplitude: 44,
    scaleDuration: 9,
    scaleAmplitude: 0.11,
    entranceDelay: 0.55,
    circlePath: circlePath(),
  },
  // 5. Bronze Mirror — medium-large, bottom right / near "a"
  {
    id: "mirror",
    label: "Bronze Mirror",
    silhouettePath: silhouettes["mirror"],
    size: 118,
    initialX: 76,
    initialY: 70,
    floatDuration: 10,
    floatAmplitude: 46,
    scaleDuration: 11,
    scaleAmplitude: 0.08,
    entranceDelay: 0.7,
    circlePath: circlePath(),
  },
  // 6. Bodhisattva — medium, below center text
  {
    id: "bodhisattva",
    label: "Bodhisattva",
    silhouettePath: silhouettes["bodhisattva"],
    size: 96,
    initialX: 43,
    initialY: 82,
    floatDuration: 14,
    floatAmplitude: 40,
    scaleDuration: 12,
    scaleAmplitude: 0.09,
    entranceDelay: 0.85,
    circlePath: circlePath(),
  },
];
