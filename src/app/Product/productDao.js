async function parentCategory(connection) {
    const parentCategoryQuery = `
                  SELECT categoryIdx, categoryName, categoryRef
                  FROM Category
                  WHERE status = 'L';
                  `;
    const [moabokiRows] = await connection.query(parentCategoryQuery);
    return moabokiRows;
  }

  async function childCategory(connection) {
    const childCategoryQuery = `
                  SELECT categoryIdx, categoryName, categoryRef
                  FROM Category
                  WHERE categoryRef = ?
                  oreder by 
                  ;
                  `;
    const [moabokiRows] = await connection.query(childCategoryQuery);
    return moabokiRows;
  }

module.exports = {
    parentCategory,
    childCategory
}