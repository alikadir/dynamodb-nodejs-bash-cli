# Query vs Scan

## Query

`A query operation searches only primary key attribute values and supports a subset of comparison operators on key attribute values to refine the search process.`

## Scan

`A scan operation scans the entire table. You can specify filters to apply to the results to refine the values returned to you, after the complete scan.`

### Operation Speed

**Query** operation is expected to be very fast and only marginally slower than a **get** operation.

**Scan** operation on the other hand can take anywhere from 50-100ms to a few hours to complete and depends on the size of the table.

## Note

Query Operasyonu getirdigi sonuc kadar _Read Unit Cost_ tuketir. Scan Operasyonu ise icinde dolastigi data kadar yani cok maliyetli ve uzun surebilir.

**Best Approach**
Query de Key leri kullanarak filtre edebilecegimiz kayit sayisini olabildigince aza indirip sonra bu azalan kayirlar uzerinde filtre (scan) islemi uygulamak.
bunu tek bir quert operasyonu ile once key belirtip sonra filtre belirterek yapabiliyoruz.

Hatta sorgu performansini iyilestirmek icin Index ler tanimlayabiliriz.

http://techtraits.com/cloud/nosql/2012/06/28/Amazon-DynamoDB-Understanding-Query-and-Scan-operations.html

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html
