#!/usr/bin/env node

import { InputData } from "./utils";
import fs from 'fs';
import { verify } from "../src/utils";

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

clear();
console.log(
  chalk.red(
    figlet.textSync('sourcify cli', { 
        horizontalLayout: 'default',
        font: 'Banner',
     })
  )
);

let repository = './repository';

program
  .version('0.0.1')
  .description("Sourcify CLI for easy verification")
  .option('-c, --chain', 'Chain/network')
  .option('-a, --address', 'Address')
  .option('-f, --files', 'Files')
  .option('-r --repository', 'Repository path')
  .parse(process.argv);

if (process.argv.length < 3) {
    program.outputHelp();
}

const inputData: InputData = {
    repository: repository,
    files: [],
    addresses: [],
    chain: ""
}

if (program.chain){
    inputData.chain = program.chain;    
}

if (program.address){
    inputData.addresses.push(program.address);
}

if (program.files) {
    for(let file in program.files){
        const readFile = fs.readFileSync(file, {encoding: "string"});
        inputData.files.push(readFile);
    }
}

if (program.repository) {
    inputData.repository = program.repository;
}

verify(inputData);
