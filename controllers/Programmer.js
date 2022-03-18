const getProgrammer = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select * from Programmeur WHERE id = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result[0]);
      } else {
         res.status(400).json("error !");
      }
   });
};

const getProgrammersBySousTache = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select s.id_programmeur, p.nom, p.prenom, p.image_profile 
                       from Programmeur p, SousTache s 
                       WHERE p.id = s.id_programmeur AND s.id = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result[0]);
      } else {
         console.log(err);
         res.status(400).json("error !");
      }
   });
};

module.exports = {
   getProgrammer,
   getProgrammersBySousTache,
};
