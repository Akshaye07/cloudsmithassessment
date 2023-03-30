public class LwcPageController {
    @AuraEnabled
    public static Date findRecord(string uniqueId){
    System.debug('Inside findrecord Method');
        List<South_Africa_Id__c> record = [SELECT id ,Name ,SA_Id_Number__c	,Date_of_Birth__c,Record_Count__c FROM
                                           South_Africa_Id__c Where SA_Id_Number__c =: uniqueId LIMIT 1];
        South_Africa_Id__c  saObj = new South_Africa_Id__c();
        saObj.id = record[0].id;
        saObj.Record_Count__c = record[0].Record_Count__c + 1 ; 
        update saObj;                              
        return record[0].Date_of_Birth__c;
    
}
    @AuraEnabled
    public static String getHoliday(String birthDate){
        String endPoint = 'https://calendarific.com/api/v2/holidays?api_key=d05803a52730e479bbd8b19726d759fd97785a55&country=ZA&year=2023';
        HttpRequest request = new HttpRequest();
        Http http = new Http();
        request.setEndpoint(endPoint);
        request.setMethod('GET');
        HttpResponse res = http.send(request);
        System.debug('Response ' + JSON.serializePretty(res.getbody()));
        Map<String,String> IdVSName = new Map<String,String>();
        Map<String,Object> body = (Map<String,Object>) JSON.deserializeUntyped(res.getbody());
        Map<String,String> dateVsName = new Map<String,String>();
        Map<String,Object> response1 = (Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(body.get('response')));
        List<Object> holiday = (List<Object>) JSON.deserializeUntyped(JSON.serialize(response1.get('holidays')));
        for(Object result: holiday) {
			Map<String, Object> obMap = (Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(result));
			String name = (String)obMap.get('name');
			Map<String, Object> dateMap = (Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(obMap.get('date')));
			dateVsName.put((String)dateMap.get('iso'),name);
			System.debug('Value in map'+JSON.serialize(dateVsName));
        }
        return dateVsName.get(birthDate);
    }
    @AuraEnabled
    Public static boolean checkSum(string saId){
        string CCNumber = saId;
        Integer sum = 0;
        Integer len = CCNumber.length();
        for(Integer i=len-1;i>=0;i--){
            Integer num = Integer.ValueOf(CCNumber.substring(i,i+1));
            if ( math.mod(i , 2) == math.mod(len, 2) )
            {
                Integer n = num * 2;
                sum += (n / 10) + ( math.mod(n, 10));
            }
            else{
                sum += num;
            }
        }
         return ( math.mod( sum, 10) == 0 );
    }
}
