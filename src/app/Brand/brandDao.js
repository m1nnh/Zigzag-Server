// Get Rank Store
async function selectRankBrand(connection, [userIdx, page, size]) {

    const rankBrandQuery = `
    select b.brandIdx,
       b.brandUrl,
       b.brandName,
       b.mainCategoryName,
       case
           when maxCouponPrice is null
               then ''

           else
               concat('최대 ', format(maxCouponPrice, 0), '원 할인 쿠폰') end as maxCouponPrice,
       case
           when s.deliveryPrice = 0
               then '무료배송'
           else
               '' end                                                  as deliveryPrice,
       ifnull(z.status, 'N')                                           as bookmarkStatus,
       ifnull(bookmarkCount, 0)    as bookmarkCount
    from Brand b
         left join Product p on p.brandIdx = b.brandIdx
         left join Store s on s.storeIdx = p.storeIdx
         left join ProductDetail pd on p.productIdx = pd.productIdx
         left join (select ifnull(count(b.brandIdx), 0) as bookmarkCount, b.brandIdx from Brand b left join Bookmark bm on bm.brandIdx = b.brandIdx
             where bm.status = 'N' group by b.brandIdx) as a on a.brandIdx = b.brandIdx
         left join (select ifnull(bm.status, 'N') as status, b.brandIdx
                    from Brand b
                             left join Bookmark bm on bm.brandIdx = b.brandIdx
                             left join User u on u.userIdx = bm.userIdx
                    where bm.userIdx = ?) as z on z.brandIdx = b.brandIdx
         left join (select ifnull(count(rc.productIdx), 0) as readCount, b.brandIdx
                    from Brand b
                             left join Product p
                                       on b.brandIdx = p.brandIdx
                             left join ReadCount rc on rc.productIdx = p.productIdx
                    where p.status = 'N'
                    group by b.brandIdx) as v on v.brandIdx = b.brandIdx
         left join (select ifnull(sum(pb.productNum), 0) as orderCount, p.brandIdx
                    from Product p
                             left join ProductDetail pd on p.productIdx = pd.productIdx
                             left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
                             left join Basket b on b.basketIdx = pb.basketIdx
                             left join OrderProduct op on op.basketIdx = b.basketIdx
                    where op.confirm = 'Y'
                      and p.status = 'N'
                    group by p.productIdx) as w on w.brandIdx = b.brandIdx
         left join (select sum(r.score) as score, brandIdx
                    from Product p
                             left join Review r on p.productIdx = r.productIdx
                    where r.status = 'N'
                      and p.status = 'N'
                    group by p.brandIdx) as y on y.brandIdx = b.brandIdx
         left join (select max(c.couponPrice) as maxCouponPrice, b.brandIdx from Brand b left join Coupon c on c.brandIdx= b.brandIdx where c.status = 'N'
         group by b.brandIdx) as x
                   on x.brandIdx = b.brandIdx
    where b.status = 'N'
    group by b.brandIdx
    order by (readCount + orderCount + score) DESC
    limit ` + page + `, ` + size + `;

      `;
    const [rankBrandRow] = await connection.query(rankBrandQuery, [userIdx, page, size]);
  
    return rankBrandRow;
}

// Get New Brand
async function selectNewBrand(connection, userIdx) {

    const countQuery = 
    `
    select concat('신규 입점 ', count(b.brandIdx)) as newBrandCount
    from Brand b
    where b.status = 'N' and timestampdiff(day, b.createdAt, current_timestamp()) < 30;
    `;

    const newBrandQuery = `
    select 
    b.brandIdx,
    b.brandUrl,
    b.brandName,
    b.mainCategoryName,
    case
        when maxCouponPrice is null
            then ''

        else
            concat('최대 ', format(maxCouponPrice, 0), '원 할인 쿠폰') end as maxCouponPrice,
    case
        when s.deliveryPrice = 0
            then '무료배송'
        else
            '' end                                                  as deliveryPrice,
    ifnull(z.status, 'N')                                           as bookmarkStatus,
    ifnull(bookmarkCount, 0)    as bookmarkCount
    from Brand b
      left join Product p on p.brandIdx = b.brandIdx
      left join Store s on s.storeIdx = p.storeIdx
      left join ProductDetail pd on p.productIdx = pd.productIdx
      left join (select ifnull(count(b.brandIdx), 0) as bookmarkCount, b.brandIdx from Brand b left join Bookmark bm on bm.brandIdx = b.brandIdx
          where bm.status = 'N' group by b.brandIdx) as a on a.brandIdx = b.brandIdx
      left join (select ifnull(bm.status, 'N') as status, b.brandIdx
                 from Brand b
                          left join Bookmark bm on bm.brandIdx = b.brandIdx
                          left join User u on u.userIdx = bm.userIdx
                 where bm.userIdx = ?) as z on z.brandIdx = b.brandIdx
      left join (select ifnull(count(rc.productIdx), 0) as readCount, b.brandIdx
                 from Brand b
                          left join Product p
                                    on b.brandIdx = p.brandIdx
                          left join ReadCount rc on rc.productIdx = p.productIdx
                 where p.status = 'N'
                 group by b.brandIdx) as v on v.brandIdx = b.brandIdx
      left join (select ifnull(sum(pb.productNum), 0) as orderCount, p.brandIdx
                 from Product p
                          left join ProductDetail pd on p.productIdx = pd.productIdx
                          left join ProductBasket pb on pb.productDetailIdx = pd.productDetailIdx
                          left join Basket b on b.basketIdx = pb.basketIdx
                          left join OrderProduct op on op.basketIdx = b.basketIdx
                 where op.confirm = 'Y'
                   and p.status = 'N'
                 group by p.productIdx) as w on w.brandIdx = b.brandIdx
      left join (select sum(r.score) as score, brandIdx
                 from Product p
                          left join Review r on p.productIdx = r.productIdx
                 where r.status = 'N'
                   and p.status = 'N'
                 group by p.brandIdx) as y on y.brandIdx = b.brandIdx
      left join (select max(c.couponPrice) as maxCouponPrice, b.brandIdx from Brand b left join Coupon c on c.brandIdx= b.brandIdx where c.status = 'N'
      group by b.brandIdx) as x
                on x.brandIdx = b.brandIdx
    where b.status = 'N' and timestampdiff(day, b.createdAt, current_timestamp()) < 30
    group by b.brandIdx
      `;
    
    let [newBrandRow] = await connection.query(newBrandQuery, userIdx);
    let [newBrandResult] = await connection.query(countQuery);

    newBrandResult[0]["newBrandResult"] = newBrandRow
    
    return newBrandResult;
}
  

module.exports = {
    selectRankBrand,
    selectNewBrand

};