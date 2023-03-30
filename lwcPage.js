import { LightningElement, track } from 'lwc';
import findRecord from '@salesforce/apex/LwcPageController.findRecord';
import getHoliday from '@salesforce/apex/LwcPageController.getHoliday';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkSum from '@salesforce/apex/LwcPageController.checkSum';

export default class LwcPage extends LightningElement {
    @track name = '';
    @track records;
    @track bDate;
    @track message = '';
    @track isLoading = false;
    error;
    nameChange(event) {
        this.name = event.target.value;
        console.log('Value of name ' + this.name);
        this.message = '';
    }



    handleSearch() {
        console.log('Inside the search button');
        this.isLoading = true;
        console.log('Value of name ' + this.name);

        findRecord({ uniqueId: this.name })
            .then((result) => {
                if (result == null || result == undefined) {
                    throw new Error("Invalid South Africa ID Number");
                }
                else {
                    this.getHolidaysHandler();

                }
                console.log('unique id' + result);
                this.records = result;
                console.log('Record found successfully !!!' + this.records);


            })
            .catch((error) => {
                this.error = error;
                this.isLoading = false;
                const evt = new ShowToastEvent({
                    title: 'Note',
                    message: error.message,
                    variant: 'Warning',
                });
                this.dispatchEvent(evt);
                console.log('Sorry the entered Id is Invalid !!');
                this.message = "<p style=\"font-size:16px; text-align: center; color: red;\"><b><br />" + "Sorry the entered Id is Invalid !!" + "</p>"

            });

    }
    getHolidaysHandler() {
        getHoliday({ birthDate: this.records })
            .then((result) => {
                console.log('Record Birth Date>>>>' + this.records);
                console.log('Inside Get Holiday>>>>>>>>' + result);
                if (result != null) {
                    this.isLoading = false;
                    this.message = "<p style=\"font-size:16px; text-align: center; color: green;\"><b><br />" + "Your Birth Date Match With Banking/Public Holidays" + "</p>"

                    const evt = new ShowToastEvent({
                        title: 'Note',
                        message: 'Your Birth Date Match With Banking/Public Holidays',
                        variant: 'Success',
                    });
                    this.dispatchEvent(evt);
                } else {
                    this.message = "<p style=\"font-size:16px; text-align: center; color: red;\"><b><br />" + "Your Birth Date Does Not Match With Any Banking/Public Holidays" + "</p>"
                    this.isLoading = false;
                    const evt = new ShowToastEvent({

                        title: 'Note',
                        message: 'Your Birth Date Does Not Match With Any Banking/Public Holidays',
                        variant: 'info',
                    });
                    this.dispatchEvent(evt);
                }
            })
            .catch((error) => {
                this.error = error;
                this.isLoading = false;
            });
    }

    get showButton() {
        let sum = 0;
        var len = this.name.length;
        for (let i = len - 1; i >= 0; i--) {
            let num = parseInt(this.name.substring(i, i + 1));
            if ((i % 2) == (len % 2)) {
                let n = (num * 2);
                sum = sum + Math.floor(n / 10) + (n % 10);
            }
            else {
                sum = sum + num;
            }
        }
        return (this.name && this.name != '' && this.name.length == 13 &&  (sum % 10) == 0 ? false : true)
    }
}
