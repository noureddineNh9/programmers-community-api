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

module.exports = {
   getSousTacheByTache,
};
