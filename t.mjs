import * as path from 'path';

const paths = ['/ciao/come/va/', '///ciao//come//va//','ciao/come/va']

paths.forEach((p)=> {
    let fixedPath = path.normalize('/' + p + '/')
    console.log(fixedPath)
})