import chalk from 'chalk';

// Estilos para la terminal
export const titulo = (text: string) =>
    chalk.bgMagenta.white.bold(` ${text} `);

export const seccion = (text: string) =>
    chalk.cyan.bold(`\n── ${text} ─────────────────────────`);

export const opcion = (clave: string, text: string) =>
    chalk.yellow(`${clave})`) + ' ' + chalk.white(text);

export const errorMsg = (text: string) => chalk.red(`✖ ${text}`);
export const okMsg = (text: string) => chalk.green(`✔ ${text}`);
export const mutedMsg = (text: string) => chalk.gray(text);

export const pregunta = (text: string) => chalk.blueBright(`❯ ${text}`);

export const divider = () =>
    console.log(chalk.gray('────────────────────────────────────'));