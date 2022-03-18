const getAllDepartments = (req, res, db) => {
   db.query("select * from departments")
      .then((data) => {
         res.status(200).json(data.rows);
      })
      .catch((err) => {
         res.status(400).json("something wrong!");
      });
};

const getDepartment = (req, res, db) => {
   const { id } = req.params;
   db.query("select * from departments WHERE department_id = $1", [id])
      .then((results) => {
         console.log();
         if (results.rows.length) {
            res.json(results.rows[0]);
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("something wrong!"));
};

const setDepartment = (req, res, db) => {
   const { department_name, manager_id } = req.body;
   if (!department_name) {
      return res.status(400).json("incorrect form submission");
   }
   db.query(
      `INSERT INTO departments( department_name, manager_id )
                   values ('${department_name}', ${manager_id}) RETURNING *`
   )
      .then((results) => {
         res.json(results.rows[0]);
      })
      .catch((err) => res.status(400).json("something wrong!"));
};

const deleteDepartment = (req, res, db) => {
   const { id } = req.params;
   db.query(`DELETE FROM departments WHERE department_id = ${id}`)
      .then((results) => {
         if (results.rowCount) {
            res.status(200).json("ok");
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("something wrong"));
};

const updateDepartment = (req, res, db) => {
   const { department_id, department_name, manager_id } = req.body;
   db.query(
      `UPDATE departments SET 
      department_name = '${department_name}', 
      manager_id = ${manager_id}
      WHERE department_id = ${department_id} RETURNING *`
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
   getDepartment: getDepartment,
   getAllDepartments: getAllDepartments,
   setDepartment: setDepartment,
   deleteDepartment: deleteDepartment,
   updateDepartment: updateDepartment,
};
