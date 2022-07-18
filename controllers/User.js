const fs = require("fs");

function removeFile(filePath) {
   fs.unlink(filePath, (err) => {
      if (err) {
         console.error(err);
         return false;
      }

      return true;
   });
}

const login = (req, res, con) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json("incorrect form submission");
   }
   con.query(`SELECT * FROM Compte WHERE email ='${email}'`, (err, result) => {
      if (!err) {
         if (result.length !== 0) {
            if (result[0].password === password) {
               con.query(
                  `SELECT * FROM Programmeur WHERE email ='${email}'`,
                  (err2, result2) => {
                     if (!err2) {
                        return res.status(200).json(result2[0]);
                     } else {
                        return res.status(400).json("something wrong !");
                     }
                  }
               );
            } else {
               return res.status(400).json("authentication failed !");
            }
         } else {
            return res.status(400).json("authentication failed ! ");
         }
      } else {
         return res.status(400).json("something wrong !");
      }
   });
};

const register = (req, res, con) => {
   const { nom, prenom, email, password } = req.body;

   const image_profile =
      req.protocol + "://" + req.get("host") + "/" + req.file.path;

   if (!nom || !prenom || !email || !password) {
      removeFile(req.file.path);
      return res.status(400).json("incorrect form submission");
   } else {
      const sqlCommand = `CALL register_procedure('${nom}','${prenom}','${email}', '${password}', '${image_profile}')`;
      con.query(sqlCommand, (err, result) => {
         if (!err) {
            const rows = result[0];
            const firstRow = rows[0];
            return res.status(200).json(firstRow);
         } else {
            removeFile(req.file.path);
            return res.status(400).json(err.sqlMessage);
         }
      });
   }
};

module.exports = {
   login,
   register,
};

/*
      con.query(
         `SELECT * FROM Compte WHERE email ='${email}'`,
         (err1, result1) => {
            if (!err1) {
               if (result1.length === 0) {
                  con.query(
                     `INSERT INTO Compte(email, password, type) 
                     values('${email}', '${password}', 'programmeur')`,
                     (err2, result2) => {
                        if (!err2) {
                           con.query(
                              `INSERT INTO Programmeur(nom, prenom, email, image_profile) 
                            values('${nom}','${prenom}','${email}', '${image_profile}')`,
                              (err3, result3) => {
                                 if (!err3) {
                                    return res.status(200).json("success");
                                 } else {
                                    return res
                                       .status(400)
                                       .json("something wrong !");
                                 }
                              }
                           );
                        } else {
                           return res.status(400).json("something wrong !");
                        }
                     }
                  );
               } else {
                  fs.unlink(req.file.path, (err) => {
                     if (err) {
                        console.error(err);
                        return;
                     }

                     console.error("err");
                  });
                  return res.status(200).json("email already exist");
               }
            } else {
               return res.status(400).json("something wrong !");
            }
         }
      );
      */
