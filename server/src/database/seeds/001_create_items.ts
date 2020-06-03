import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("items").del()
        .then(() => {
            // Inserts seed entries
            return knex("items").insert([
                { title: 'Lâmpadas', image: 'lampadas.svg' },
                { title: 'Pilhas e Baterias', image: 'pilhas.svg' },
                { title: 'Papéis e Papelão', image: 'papeis-papela.svg' },
                { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
                { title: 'Óleo de Cozinha', image: 'oleo.svg' },
            ]);
        });
};
