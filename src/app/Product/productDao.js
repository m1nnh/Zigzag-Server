// UserIdx Check
async function selectUserIdx(connection, userIdx) {
  const userIdxQuery = `
    select exists(select userIdx from User where userIdx = ?) as exist;
     `;
  const [userIdxRow] = await connection.query(userIdxQuery, userIdx);
  return userIdxRow;
}


// Get Home
async function selectHomeProduct(connection, [page, size]) {

  const homeProductQuery = `
  select p.storeIdx,
      p.productIdx,
      thumbnailUrl,
      zFlag,
      s.storeName,
      productContents,
      case
          when productSale > 0 and zSaleFlag = 'N'
              then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
          when productSale > 0 and zSaleFlag = 'Y'
              then concat('제트할인가 ', productPrice, '\n',productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
          else
              format(productPrice, 0) end as resultPrice,
      case
        when s.deliveryPrice = 0
              then '무료배송'
          else
                  '' end as deliveryPrice,
      case
          when p.brandIdx is null
              then ''
          else
              '브랜드' end                   as brandStatus
    from Product p
        left join Store s on s.storeIdx = p.storeIdx
    order by rand()
    limit ` + page + `, ` + size + `;
    `;
  const [homeProductRow] = await connection.query(homeProductQuery, [page, size]);
  
  return homeProductRow;
}

// Get Like Product Status
async function selectLikeProductStatus(connection, userIdx) {

  const likeProductStatusQuery = `
    select lp.productIdx, lp.status
    from Product p
    left join LikeProduct lp on lp.productIdx = p.productIdx
    where lp.userIdx = ?;
  
    `;
  const [likeProductStatusRow] = await connection.query(likeProductStatusQuery, userIdx);
  
  return likeProductStatusRow;
}

// Get Brand Product
async function selectBrandProduct(connection, [page, size]) {

  const brandProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       b.brandName,
       productContents,
       case
           when productSale > 0 and zSaleFlag = 'N'
               then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
           when productSale > 0 and zSaleFlag = 'Y'
               then concat('제트할인가 ', productPrice, '\n', productSale, '% ',
                           format(productPrice * ((100 - productSale) / 100), 0))
           else
               format(productPrice, 0) end as resultPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                      as deliveryPrice

  from Product p
         left join Store s on s.storeIdx = p.storeIdx
         left join LikeProduct lp on lp.productIdx = p.productIdx
         left join Brand b on b.brandIdx = p.brandIdx
  order by rand()
  limit ` + page + `, ` + size + `;
  `;
    
  const [brandProductRow] = await connection.query(brandProductQuery, [page, size]);
  
  return brandProductRow;
}

// Get Brand Rank
async function selectBrandRank(connection, condition) {

const brandRankQuery = `
select b.brandIdx, b.brandUrl brandName
from Brand b
         left join Product p on p.brandIdx = b.brandIdx
         left join ReadCount rc on rc.productIdx = p.productIdx
        left join Category c on p.categoryIdx = c.categoryIdx
`+ condition +`
group by brandIdx
order by ifnull(count(rc.productIdx),0) DESC
limit 3;
`;
  
const [brandRankRow] = await connection.query(brandRankQuery, condition);

return brandRankRow;
}

// Get BookMark Brand Status
async function selectBookMarkStatus(connection, userIdx) {

  const bookMarkStatusQuery = `
    select b.brandIdx, bm.status
    from Brand b
    left join Bookmark bm on bm.brandIdx = b.brandIdx
    where bm.userIdx = ?;
  
    `;
  const [bookMarkStatusRow] = await connection.query(bookMarkStatusQuery, userIdx);
  
  return bookMarkStatusRow;
}

// Get Rank Brand Product
async function selectRankBrandProduct(connection, brandIdx) {

  const brandProductQuery = `select s.storeIdx, p.productIdx, p.ThumbnailUrl
  from Brand b
  left join Product p on p.brandIdx = b.brandIdx
  left join Store s on s.storeIdx = p.storeIdx
  where b.brandIdx = ? 
  limit 20`;

    
  const [brandProductRow] = await connection.query(brandProductQuery, brandIdx);
  
  return brandProductRow;
}

// Get Best Product
async function selectBestProduct(connection, [page, size, condition, agecondition]) {

  const bestProductQuery = `
    select p.storeIdx,
    p.productIdx,
    thumbnailUrl,
    zFlag,
    s.storeName,
    productContents,
    case
        when productSale > 0 and zSaleFlag = 'N'
            then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
        when productSale > 0 and zSaleFlag = 'Y'
            then concat('제트할인가 ', productPrice, '\n', productSale, '% ',
                        format(productPrice * ((100 - productSale) / 100), 0))
        else
            format(productPrice, 0) end as resultPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                      as deliveryPrice
  from Product p
      left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
      left join (select ifnull(count(rc.productIdx), 0) as readCount, rc.productIdx, rc.userIdx

                        from ReadCount rc
                group by rc.productIdx) as v on v.productIdx = p.productIdx
      left join User u on v.userIdx = u.userIdx
  ` + condition + ` `+ agecondition +`
  group by p.productIdx
  order by readCount DESC
  limit ` + page + `, ` + size + `;
  `;

  const [bestProductRow] = await connection.query(bestProductQuery, [page, size, condition, agecondition]);
  
  return bestProductRow;
  }



// 여기서부터 토미

async function parentCategory(connection) {
  const parentCategoryQuery = `
                SELECT categoryName, categoryIdx
                FROM Category
                WHERE status = 'L';
                `;
  const [moabokiRows] = await connection.query(parentCategoryQuery);
  return moabokiRows;
}
async function childCategory(connection, categoryIdx) {
  const childCategoryQuery = `
                SELECT categoryIdx, categoryName
                FROM Category
                WHERE categoryRef = ?;
                `;
  const [moabokiRows] = await connection.query(childCategoryQuery, [categoryIdx]);
  return moabokiRows;
}  
async function likeProductStatus (connection, userIdx) {
  const likeProductStatusQuery = `
  SELECT lp.productIdx, lp.status
  FROM LikeProduct lp
  WHERE lp.userIdx = ?
  `
  const [likeProductStatusRows] = await connection.query(likeProductStatusQuery, [userIdx]);
  return likeProductStatusRows;
}
async function detailCategoryIdx(connection, categoryIdx, where, order, page, size) {
    const detailCategoryIdxQuery = `
               SELECT p.productIdx, p.storeIdx, thumbnailUrl, s.storeName, lp.status, productContents , p.brandIdx,
               CASE
               WHEN productSale > 0 and zSaleFlag = 'N'
               THEN concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
               WHEN productSale > 0 and zSaleFlag = 'Y'
               then concat('제트할인가 ', productPrice, '\n',productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
               ELSE format(productPrice, 0) end as resultPrice,
               CASE
               WHEN s.deliveryPrice = 0
               THEN '무료배송'
               ELSE '' end as deliveryPrice
               FROM zigzag.Product p
               LEFT JOIN Store s ON s.storeIdx = p.storeIdx
               LEFT JOIN LikeProduct lp ON lp.productIdx = p.productIdx
               LEFT JOIN Category c ON c.categoryIdx = p.categoryIdx
               LEFT JOIN Basket b ON b.productIdx = p.productIdx
               LEFT JOIN OrderProduct op ON op.basketIdx = b.basketIdx
               LEFT JOIN Review r ON r.orderIdx = op.orderIdx
               LEFT JOIN ReadCount rc ON p.productIdx = rc.productIdx
               WHERE p.categoryIdx = ?
               `+where+`
               GROUP BY p.productIdx
               `+ order +`
               limit ` + page + `, ` + size + `;`
  const [moabokiRows] = await connection.query(detailCategoryIdxQuery, [categoryIdx, where, order, page, size]);
  return moabokiRows;
} // 상세 카테고리 상품 조회
async function detailCategoryRef(connection, categoryIdx, where, order, page, size) {
  const detailCategoryRefQuery = `
               SELECT p.productIdx, p.storeIdx, thumbnailUrl, s.storeName, lp.status, productContents, p.brandIdx,
               CASE
               WHEN productSale > 0 and zSaleFlag = 'N'
               THEN concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
               WHEN productSale > 0 and zSaleFlag = 'Y'
               then concat('제트할인가 ', productPrice, '\n',productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
               ELSE format(productPrice, 0) end as resultPrice,
               CASE
               WHEN s.deliveryPrice = 0
               THEN '무료배송'
               ELSE '' end as deliveryPrice
               FROM zigzag.Product p
               LEFT JOIN Store s ON s.storeIdx = p.storeIdx
               LEFT JOIN LikeProduct lp ON lp.productIdx = p.productIdx
               LEFT JOIN Category c ON c.categoryidx = p.categoryIdx
               LEFT JOIN Basket b ON b.productIdx = p.productIdx
               LEFT JOIN OrderProduct op ON op.basketIdx = b.basketIdx
               LEFT JOIN Review r ON r.orderIdx = op.orderIdx
               LEFT JOIN ReadCount rc ON p.productIdx = rc.productIdx
               WHERE c.categoryRef = ? 
               `+where+`
               GROUP BY p.productIdx
               ` + order + `
               limit ` + page + `, ` + size + `;`
  const [moabokiRows] = await connection.query(detailCategoryRefQuery, [categoryIdx, where, order, page, size]);
  return moabokiRows;
}













module.exports = {
    selectHomeProduct,
    selectLikeProductStatus,
    selectUserIdx,
    selectBrandProduct,
    selectBrandRank,
    selectBookMarkStatus,
    selectRankBrandProduct,
    selectBestProduct,







    parentCategory,
    childCategory,
    likeProductStatus,
    detailCategoryIdx,
    detailCategoryRef 
  };
  