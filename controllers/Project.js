const { con } = require("../db");

const getAllProjects = (req, res, con) => {
   con.query("select * from Projet", (err, result) => {
      if (!err) {
         res.status(200).json(result);
      } else {
         res.status(400).json("error !");
      }
   });
};

const getProjet = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select * from Projet WHERE id = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result[0]);
      } else {
         res.status(400).json("error !");
      }
   });
};
const getProjetsByProprietaire = (req, res, con) => {
   const { id } = req.params;

   const sqlCommand = `select * from Projet WHERE id_proprietaire = ${id}`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json(result);
      } else {
         res.status(400).json("error !");
      }
   });
};

const setProjet = (req, res, con) => {
   console.log(req.body);
   const { titre, description, id_proprietaire } = req.body;
   if (!titre || !description || !id_proprietaire) {
      return res.status(400).json("incorrect form submission");
   }

   const sqlCommand = `INSERT INTO Projet( titre, description, id_proprietaire )
   values ('${titre}', '${description}', ${id_proprietaire})`;

   con.query(sqlCommand, (err, result) => {
      if (!err) {
         res.status(200).json("success");
      } else {
         res.status(400).json("error !");
      }
   });
};

const deleteEmployee = (req, res, db) => {
   const { id } = req.params;
   db.query(`DELETE FROM employees WHERE employee_id = ${id}`)
      .then((results) => {
         if (results.rowCount) {
            res.status(200).json("ok");
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("something wrong"));
};

const updateEmployee = (req, res, db) => {
   let {
      employee_id,
      first_name,
      last_name,
      email,
      department_id,
      manager_id,
   } = req.body;
   if (manager_id == 0) {
      manager_id = null;
   }
   if (department_id == 0) {
      department_id = null;
   }
   console.log(
      employee_id,
      first_name,
      last_name,
      email,
      department_id,
      manager_id
   );
   db.query(
      `UPDATE employees SET 
      first_name = '${first_name}',
      last_name = '${last_name}',
      email = '${email}',
      manager_id = ${manager_id},
      department_id = ${department_id} 
      WHERE employee_id = ${employee_id} RETURNING *`
   )
      .then((results) => {
         if (results.rowCount) {
            res.status(200).json(results.rows[0]);
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("something wrong"));
};

module.exports = {
   getProjet,
   getAllProjects,
   setProjet,
   getProjetsByProprietaire,
};
