exports.result = result;
function result(data, success, message) {
    var result = {};
    result['data'] = data;
    result['success'] = success;
    result['message'] = message;
    return result;
}

exports.convertedResult = convertedResult;
function convertedResult(data) {
    var result = {
        id: data.ID,
        date: data.AUCTION_DATE?  data.AUCTION_DATE: '',
        result_en: '',
        color_en: data.COLOR?  data.COLOR: '',
        auct_system_ref: '',
        special_num: '',
        inspection_en: '',
        end_price_en: 0,
        result_num: 0,
        model_type_en: '',
        datetime: data.AUCTION_DATE?  data.AUCTION_DATE : '',
        is_special: 0,
        model_year_en: data.YEAR? parseInt(data.YEAR): 0,
        auction_name: '',
        displacement: '',
        color_ref: 0,
        pics_downloaded: 0,
        equipment_en: '',
        transmission_en: '',
        start_price_en: 0,
        mileage_en: '',
        _id: 0,
        end_price_usd: 0,
        end_price_num: data.FINISH? data.FINISH: 0,
        scores: data.RATE? data.RATE : '0',
        truck: '',
        model_name_ref: 0,
        awd_num: 0,
        company_en: data.MARKA_NAME,
        chassis_no: '',        
        mileage_num: data.MILEAGE? data.MILEAGE: 0,
        discplacement_num: data.ENG_V? data.ENG_V : '' ,
        company_ref: data.MARKA_ID,
        average_price: data.AVG_PRICE? data.AVG_PRICE : 0,
        downloadtime: data.TIME? data.TIME : '',
        start_price_num: data.START? data.START : 0,
        pic12: '',
        pic11: '',
        processed: true,
        model_detail: '',
        model_grade_en: '',
        auct_ref: '',
        auction_system: '',
        createddate: '',
        model_name_en: data.MODEL_NAME? data.MODEL_NAME : '',
        start_price_usd: 0,
        pic13: '',
        left_hd: '',
        bid: data.LOT? data.LOT : 0,
        parsed_data_en: ''
    };

    if (data.IMAGES) {
        var imageStr = data.IMAGES;

        var imageArray = imageStr.split('#');
        if (imageArray.length > 0) {
            for( var i = 0; i < imageArray.length; i++) {
                result[`pic${i + 2}`] = imageArray[i];
            }
        }
    }
    return result;
}
