import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // configurando onde os arquivos/imagens serão salvos
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    // definindo nome do arquivo para ser salvo
    // recebe uma função que não possui async/await portanto, deve-se utilizar um callback para tratar a resposta
    filename: (req, file, callback) => {
      // gerando estring de 16 cass
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        // primeiro parametro o erro, quando funciona o erro deve ser null
        // pegando resposta em hexadecial e concatenando com a extenção do arquivo
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
