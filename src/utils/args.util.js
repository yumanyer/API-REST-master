import { Command } from "commander";

const args = new Command();
// esta variable nos da acceso a el array que imprme como console.log(procces.args)

// metodo option = REQUIERE QUE LE PASE COMO MINIMO 2 PARAMETROS
args.option("-p <port>", "puerto", );
args.option("--mode <mode>", "modo", "produccion");

args.parse();

export default args.opts();