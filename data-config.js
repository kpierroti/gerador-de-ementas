// data-config.js
window.PUD_CONFIG = {
  STORAGE_KEY: "pud_courses_v1",

  WEEKDAYS: [
    { key: "seg", label: "Segunda" },
    { key: "ter", label: "Terça" },
    { key: "qua", label: "Quarta" },
    { key: "qui", label: "Quinta" },
    { key: "sex", label: "Sexta" },
    { key: "sab", label: "Sábado" },
    { key: "dom", label: "Domingo" },
  ],

  BASE_DATA: {
    criancas: {
      label: "Crianças",
      description:
        "Trilhas pensadas para introdução criativa e desenvolvimento de habilidades.",
      areas: {
        audiovisual: { label: "Audiovisual", accentClass: "accent-audiovisual", lanes: [] },
        design:      { label: "Design e Marketing", accentClass: "accent-design", lanes: [] },
        prog:        { label: "Programação e Games", accentClass: "accent-prog", lanes: [] },
        eco:         { label: "Economia Criativa", accentClass: "accent-eco", lanes: [] },
        niv:         { label: "Nivelamento", accentClass: "accent-niv", lanes: [] },
      },
    },

    jovens_adultos: {
      label: "Jovens e Adultos",
      description:
        "Trilhas para aprofundamento técnico, portfólio e projetos aplicados.",
      areas: {
        audiovisual: { label: "Audiovisual", accentClass: "accent-audiovisual", lanes: [] },
        design:      { label: "Design e Marketing", accentClass: "accent-design", lanes: [] },
        prog:        { label: "Programação e Games", accentClass: "accent-prog", lanes: [] },
        eco:         { label: "Economia Criativa", accentClass: "accent-eco", lanes: [] },
        niv:         { label: "Nivelamento", accentClass: "accent-niv", lanes: [] },
      },
    },

    seniors: {
      label: "Seniors",
      description:
        "Espaço reservado para trilhas específicas. Você pode preencher os cursos aqui.",
      areas: {
        audiovisual: { label: "Audiovisual", accentClass: "accent-audiovisual", lanes: [] },
        design:      { label: "Design e Marketing", accentClass: "accent-design", lanes: [] },
        prog:        { label: "Programação e Games", accentClass: "accent-prog", lanes: [] },
        eco:         { label: "Economia Criativa", accentClass: "accent-eco", lanes: [] },
        niv:         { label: "Nivelamento", accentClass: "accent-niv", lanes: [] },
      },
    },

    nivelamento: {
      label: "Nivelamento",
      description:
        "Cursos de entrada e revisão para preparar participantes para trilhas avançadas.",
      areas: {
        audiovisual: { label: "Audiovisual", accentClass: "accent-audiovisual", lanes: [] },
        design:      { label: "Design e Marketing", accentClass: "accent-design", lanes: [] },
        prog:        { label: "Programação e Games", accentClass: "accent-prog", lanes: [] },
        eco:         { label: "Economia Criativa", accentClass: "accent-eco", lanes: [] },
        niv:         { label: "Nivelamento", accentClass: "accent-niv", lanes: [] },
      },
    },
  },

  PUD_AREA_LABEL: {
    audiovisual: "Audiovisual",
    design: "Design e Marketing",
    prog: "Programação e Games",
    eco: "Economia Criativa",
    niv: "Nivelamento",
  },
};