const getTachesByProjet = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select * from Tache WHERE id_projet = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result);
      } else {
         res.status(400).json("error !");
      }
   });
};

const setTache = (req, res, con) => {
   const { titre, description, priorite, id_projet } = req.body;
   if (!titre || !description || !priorite || !id_projet) {
      return res.status(400).json("incorrect form submission");
   }

   const sqlCommand = `INSERT INTO Tache( titre, description, priorite, id_projet )
   values ('${titre}', '${description}', '${priorite}', ${id_projet})`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         con.query(
            "select * from Tache order by id desc LIMIT 1",
            (err2, result2) => {
               if (!err2) {
                  var tache = result2[0];
                  tache = {
                     ...tache,
                     sousTaches: [],
                  };
                  res.status(200).json(tache);
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
   getTachesByProjet,
   setTache,
};
