// Visualizations that only the lab platform has (the trace tables, the recursion tree, Kruskal with
// union-find). The site never reads this file: the platform's course import places them beside the
// site's own `embeds` (course.mjs), by notebook and cell index in the .ipynb, the same way.
// A cell takes one visualization, so these use cells the site leaves free.

export const embeds = {
  'laborator-03-ushtrime-shtese.ipynb': [
    // After "Vëzhgoni": the work per level, as a tree.
    { cell: 8, viz: 'pema-rekursive', title: 'Pema rekursive e Merge Sort' },
  ],
  'laborator-05.ipynb': [
    // Laboratori 6, Ushtrimi 5: Kahn mbi lëndët.
    { cell: 9, viz: 'tabela-gjurmimit', title: 'Gjurmoni Kahn-in', props: { preset: 'lab06-kahn' } },
    // Punë në Klasë, Problemet 2 dhe 3.
    { cell: 15, viz: 'tabela-gjurmimit', title: 'Gjurmoni Kruskal-in', props: { preset: 'lab05-kruskal' } },
    { cell: 16, viz: 'tabela-gjurmimit', title: 'Gjurmoni Prim-in', props: { preset: 'lab05-prim' } },
  ],
  'laborator-05-ushtrime-shtese.ipynb': [
    // Ushtrimi 7: the union-find forest of Ushtrimi 6, at work in Kruskal.
    { cell: 22, viz: 'kruskal-prim', title: 'Kruskal me union-find, krahas Prim' },
  ],
  'laborator-07.ipynb': [
    // Punë në Klasë, Problemet 1 dhe 2.
    { cell: 16, viz: 'tabela-gjurmimit', title: 'Gjurmoni Dijkstra-n', props: { preset: 'lab07-dijkstra' } },
    { cell: 17, viz: 'tabela-gjurmimit', title: 'Gjurmoni Bellman-Ford-in', props: { preset: 'lab07-bellman' } },
  ],
  'laborator-08.ipynb': [
    // Punë në Klasë: D pas çdo k.
    { cell: 12, viz: 'tabela-gjurmimit', title: 'Gjurmoni Floyd-Warshall-in', props: { preset: 'lab08-floyd' } },
  ],
};
