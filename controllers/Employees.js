const getAllEmployees = (req, res, db) => {
   db.query(
      "select *, concat(last_name,' ',first_name) as full_name from employees"
   )
      .then((data) => {
         res.status(200).json(data.rows);
      })
      .catch((err) => {
         res.status(400).json("error getting employees!");
      });
};

const get = (req, res, db) => {
   const { id } = req.params;
   db.query(
      "select *, concat(last_name,' ',first_name) as full_name from employees WHERE employee_id = $1",
      [id]
   )
      .then((results) => {
         console.log();
         if (results.rows.length) {
            res.json(results.rows[0]);
         } else {
            res.status(400).json("Not found");
         }
      })
      .catch((err) => res.status(400).json("error getting employee"));
};

const setEmployee = (req, res, db) => {
   console.log(req.body);
   const { first_name, last_name, email, department_id, manager_id } = req.body;
   if (!email || !first_name || !last_name) {
      return res.status(400).json("incorrect form submission");
   }
   db.query(
      `INSERT INTO employees( first_name, last_name, email, department_id, manager_id )
                   values ('${first_name}', '${last_name}', '${email}', ${department_id}, ${manager_id}) RETURNING *`
   )
      .then((results) => {
         res.json(results.rows[0]);
      })
      .catch((err) => res.status(400).json("error getting employee :: " + err));
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

const uploadImage = (req, res, db, multer) => {};

module.exports = {
   getEmployee: getEmployee,
   getAllEmployees: getAllEmployees,
   setEmployee: setEmployee,
   deleteEmployee: deleteEmployee,
   updateEmployee: updateEmployee,
};
