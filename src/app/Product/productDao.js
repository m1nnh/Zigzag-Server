async function selectHomeProduct(connection, [page, size]) {

    const homeProductQuery = `
    select p.storeIdx,
    p.productIdx,
    ThumbnailUrl,
    lp.status,
    s.storeName,
    productContents,
    case
        when productSale > 0
            then concat(productSale, '% ', format(productPrice * ((100 - productSale) / 100), 0))
        else
            format(productPrice, 0) end as resultPrice,
   case
       when s.deliveryPrice = 0
             then '무료배송'
         else
                 '' end as deliveryPrice
    from Product p
      left join Store s on s.storeIdx = p.storeIdx
      left join LikeProduct lp on lp.productIdx = p.productIdx
      left join User u on u.userIdx = 1
    order by rand()
    limit ` + page + `, ` + size + `;
      `;
  
    const [homeProductRow] = await connection.query(homeProductQuery, [page, size]);
    return homeProductRow;
  }

module.exports = {
    selectHomeProduct
  };
  