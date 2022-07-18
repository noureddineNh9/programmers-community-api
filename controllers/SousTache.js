const getSousTacheByTache = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select * from SousTache WHERE id_tache = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result);
      } else {
         res.status(400).json("error !");
      }
   });
};

const setSousTache = (req, res, con) => {
   console.log(req.body);
   const { titre, description, id_tache, id_programmeur } = req.body;
   if (!titre || !description || !id_tache || !id_programmeur) {
      return res.status(400).json("incorrect form submission");
   }

   const sqlCommand = `INSERT INTO SousTache( titre, description, id_tache, id_programmeur )
   values ('${titre}', '${description}', '${id_tache}', ${id_programmeur})`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         con.query(
            "select * from SousTache order by id desc LIMIT 1",
            (err2, result2) => {
               if (!err2) {
                  var sousTache = result2[0];
                  con.query(
                     `select * from Programmeur WHERE id = ${sousTache.id_programmeur}`,
                     (err3, result3) => {
                        if (!err3) {
                           var assignee = result3[0];

                           sousTache = {
                              ...sousTache,
                              assignee: assignee,
                           };
                           console.log(sousTache);
                           res.status(200).json(sousTache);
                        } else {
                           res.status(400).json("error !");
                        }
                     }
                  );
               } else {
                  res.status(400).json("error !");
               }
            }
         );
      } else {
         res.status(400).json("error !");
      }
   });
};

module.exports = {
   getSousTacheByTache,
   setSousTache,
};
