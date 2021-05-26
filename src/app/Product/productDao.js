// userIdx Check
async function selectUserIdx(connection, userIdx) {
  const userIdxQuery = `
    select exists(select userIdx from User where userIdx = ?) as exist;
     `;
  const [userIdxRow] = await connection.query(userIdxQuery, userIdx);
  return userIdxRow;
}

// productIdx Check
async function selectProductIdx(connection, productIdx) {
  const productIdxQuery = `
    select exists(select productIdx from Product where productIdx = ?) as exist;
     `;
  const [productIdxRow] = await connection.query(productIdxQuery, productIdx);
  return productIdxRow;
}


// Get Home Product
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
async function selectBrandProduct(connection, [page, size, brandIdx]) {

  const brandProductQuery = `
    select p.storeIdx,
       p.productIdx,
       p.brandIdx,
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
  where p.brandIdx = ?
  order by rand()
  limit ` + page + `, ` + size + `;
  `;
    
  const [brandProductRow] = await connection.query(brandProductQuery, [brandIdx, page, size]);
  
  return brandProductRow;
}

// Get CategoryIdx
async function selectCategoryIdx(connection, num) {

  const categoryIdxQuery = `
    select categoryIdx from Category where categoryRef = ` + num + ``;
  const [categoryIdxRow] = await connection.query(categoryIdxQuery, num);
  
  return categoryIdxRow;
}

// Get Brand Rank
async function selectBrandRank(connection, condition) {

  const brandRankQuery = `
    select b.brandIdx, b.brandUrl, b.brandName
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

  const brandProductQuery = `select s.storeIdx, p.productIdx, p.thumbnailUrl
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

// Get Time Sale Product
async function selectTimeSaleProduct(connection, [page, size]) {

  const timeSaleProductQuery = `
    select p.storeIdx,
       p.productIdx,
       thumbnailUrl,
       zFlag,
       s.storeName,
       p.productContents,
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
               '' end                      as deliveryPrice,
       case
           when p.brandIdx is null
               then ''
           else
               '브랜드' end                   as brandStatus
    from Product p
         left join Store s on s.storeIdx = p.storeIdx
    where p.timeSale = 'Y'
    limit ` + page + `, ` + size + `;
    `;
  const [timeSaleProductRow] = await connection.query(timeSaleProductQuery, [page, size]);
  
  return timeSaleProductRow;
}


// Get Sale Product
async function selectSaleProduct(connection, condition) {

  const saleProductQuery = `
    select p.storeIdx,
        p.productIdx,
        c.categoryRef,
        thumbnailUrl,
        zFlag,
        s.storeName,
        p.productContents,
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
                '' end                      as deliveryPrice,
        case
            when p.brandIdx is null
                then ''
            else
                '브랜드' end                   as brandStatus
    from Product p
          left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
    where p.productSale != 0 ` + condition + `
    order by p.productSale DESC
    limit 10;`;
  const [saleProductRow] = await connection.query(saleProductQuery, condition);
  
  return saleProductRow;
}

// Get New Sale Product
async function selectNewSaleProduct(connection, [page, size, condition]) {

  const newSaleProductQuery = `
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
                '' end                      as deliveryPrice,
        case
            when p.brandIdx is null
                then ''
            else
                '브랜드' end                   as brandStatus
  from Product p
          left join Store s on s.storeIdx = p.storeIdx
          left join Category c on c.categoryIdx = p.categoryIdx
  where timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7 and p.productSale != 0 ` + condition + `
  limit ` + page + `, ` + size + `;  
  `;

  const [newSaleProductRow] = await connection.query(newSaleProductQuery, [page, size, condition]);
  
  return newSaleProductRow;
}

// Get New Product
async function selectNewProduct(connection, [page, size]) {

  const newProductQuery = `
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
            '' end                      as deliveryPrice,
    case
        when p.brandIdx is null
            then ''
        else
            '브랜드' end                   as brandStatus
    from Product p
        left join Store s on s.storeIdx = p.storeIdx
    where timestampdiff(day, p.createdAt, CURRENT_TIMESTAMP()) < 7
    limit ` + page + `, ` + size + `;
  `;

  const [newProductRow] = await connection.query(newProductQuery, [page, size]);
  
  return newProductRow;
}


// Get Product Image
async function selectProductImage(connection, productIdx) {

  const productImageQuery = `
    select productImage
    from Product p
    left join ProductImage pi on p.productIdx = pi.productIdx
    where p.productIdx = ?;
  `;

  const [productImageRow] = await connection.query(productImageQuery, productIdx);
  
  return productImageRow;
}

// Get Product Intro
async function selectProductIntro(connection, productIdx) {

  const productIntroQuery = `
    select s.storeIdx, p.productIdx, zFlag, productContents, ifnull(sum(r.score) / count(r.reviewIdx), 0) as score, count(r.reviewIdx) as reviewCount,
    case
        when productSale > 0 and zSaleFlag = 'N'
            then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
        when productSale > 0 and zSaleFlag = 'Y'
            then concat('제트할인가\n', productSale, '% ',
                        format(productPrice * ((100 - productSale) / 100), 0), '  ',  p.productPrice)
        else
            format(productPrice, 0) end as resultPrice,
    s.productPayInfo,
    case
        when 8 < date_format(now(), '%H') and date_format(now(), '%H') < 21
            then concat('내일 도착 예정')
      else
            concat('내일 모레 도착 예정') end as productReceiptDay,
    case
        when s.deliveryPrice = 0
            then '조건 없이 무료'
        else
            s.deliveryPrice end                      as deliveryPrice,
    s.deliveryInfo, s.reInfo

    from Product p
      left join Review r on r.productIdx = p.productIdx
      left join Store s on s.storeIdx = p.storeIdx
    where p.productIdx = ?;
  `;

  const [productIntroRow] = await connection.query(productIntroQuery, productIdx);
  
  return productIntroRow;
}

// Insert ReadCount
async function insertReadCount(connection, [productIdx, userIdx]) {

  const insertReadCountQuery = `
    insert into ReadCount(productIdx, userIdx) VALUES (?, ?);
  `;

  const [insertReadRow] = await connection.query(insertReadCountQuery, [productIdx, userIdx]);
  
  return insertReadRow;
}

// Get Store Info
async function selectStoreInfo(connection, storeIdx) {

  const storeInfoQuery = `
  select storeUrl, storeName, count(b.storeIdx) as bookmarkCount
  from Store s
           left join Bookmark b on s.storeIdx = b.storeIdx
  where s.storeIdx = ?;
  `;
  const [storeInfoRow] = await connection.query(storeInfoQuery, storeIdx);

  return storeInfoRow;
}

// Get BookMark Store Status
async function selectStoreStatus(connection, userIdx) {

  const bookMarkStatusQuery = `
    select s.storeIdx, bm.status
    from Store s
    left join Bookmark bm on bm.storeIdx = s.storeIdx
    where bm.userIdx = ?;
    `;
  const [bookMarkStatusRow] = await connection.query(bookMarkStatusQuery, userIdx);
  
  return bookMarkStatusRow;
}

// Get First Category Reference  List
async function selectFirstCategoryList(connection, storeIdx) {

  const categoryListQuery = `
    select c.categoryRef
    from Store s
    left join Product p on p.storeIdx = s.storeIdx
    left join Category c on p.categoryIdx = c.categoryIdx
    where s.storeIdx = ?
    group by c.categoryRef;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, storeIdx);
  
  return categoryListRow;
}

// Get Second Category Reference  List
async function selectSecondCategoryList(connection, categoryRef) {

  const categoryListQuery = `
  select c.categoryRef
  from Category c
  where categoryIdx = ?;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, categoryRef);
  
  return categoryListRow;
}

// Get Last Category List
async function selectLastCategoryList(connection, categoryRef) {

  const categoryListQuery = `
    select c.categoryIdx, c.categoryName
    from Category c
    where categoryIdx = ?;
    `;
  const [categoryListRow] = await connection.query(categoryListQuery, categoryRef);
  console
  return categoryListRow;
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
    selectProductIdx,
    selectBrandProduct,
    selectCategoryIdx,
    selectBrandRank,
    selectBookMarkStatus,
    selectRankBrandProduct,
    selectBestProduct,
    selectTimeSaleProduct,
    selectSaleProduct,
    selectNewSaleProduct,
    selectNewProduct,
    selectProductImage,
    selectProductIntro,
    insertReadCount,
    selectStoreInfo,
    selectStoreStatus,
    selectFirstCategoryList,
    selectSecondCategoryList,
    selectLastCategoryList,





    parentCategory,
    childCategory,
    likeProductStatus,
    detailCategoryIdx,
    detailCategoryRef

    
  };
  