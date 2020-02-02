# tum tablolar icin 
aws dynamodb list-tables

# tum kayitlar icin
aws dynamodb scan \
--table-name users 

# tek bir kayit getirmek icin 
aws dynamodb get-item \
--table-name users \
--key '{"userName":{"S":"rabia"}}'

# kayit ekleme (nodejs kullaniyorsak direk json model gonderebiliriz ayrica tip belirtmemize gerek yok)
aws dynamodb put-item \
--table-name users \
--item '{"userName":{"S":"hilal"},"age":{"N":"34"},"isMale":{"BOOL":false},"name":{"S":"Hilal BAĞCIOĞLU"}}'

# kayit guncelleme
aws dynamodb update-item \
--table-name users \
--key '{"userName":{"S":"alikadir"}}' \
--update-expression 'SET #n = :pramName, #im = :pramIsMale' \
--expression-attribute-name '{"#n":"name","#im":"isMale"}' \
--expression-attribute-values '{ ":pramName": {"S":"Ali Veli Osman Nuri"}, ":pramIsMale": {"BOOL": false} }' \
--return-values ALL_NEW

# kayit guncelleme (reserved keyword'e sebep olacak column name yoksa)
aws dynamodb update-item \
--table-name users \
--key '{"userName":{"S":"alikadir"}}' \
--update-expression 'SET age = :pramAge, isMale = :pramIsMale' \
--expression-attribute-values '{ ":pramAge": {"N":"61"} , ":pramIsMale": {"BOOL": false} }' \
--return-values ALL_NEW

#---- kayit guncellerken ----# 

# SET = varolan column'larin degerlerini degistirir 
# --update-expression 'SET age = :pramAge, isMale = :pramIsMale'

# ADD = hedeflenen kayda yeni column ve belirtilen value'ekler 
# --update-expression 'ADD height = :pramHeight, culture = :pramCulture'

# REMOVE = hedeflenen kayitta bulunan column'lari siler
# --update-expression "REMOVE height, culture" 


# kayit silme
aws dynamodb delete-item \
--table-name users \
--key '{"userName":{"S":"hilal"}}'

# query yazma (filter eksik)
aws dynamodb query \
--table-name users \
--key-condition-expression "userName = :pramUserName" \
--expression-attribute-values '{":pramUserName":{"S":"alikadir"}}'


// tablonun meta bilgisi icin 
aws dynamodb describe-table --table-name users
