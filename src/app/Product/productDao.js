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
      ThumbnailUrl,
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
                  '' end as deliveryPrice
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
       ThumbnailUrl,
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
async function selectBestProduct(connection, [userIdx, page, size]) {

  const bestProductQuery = `
    
  `;
    
  const [bestProductRow] = await connection.query(bestProductQuery, [userIdx, page, size]);
  
  return bestProductRow;
  }

module.exports = {
    selectHomeProduct,
    selectLikeProductStatus,
    selectUserIdx,
    selectBrandProduct,
    selectBrandRank,
    selectBookMarkStatus,
    selectRankBrandProduct,
    selectBestProduct
  };
  