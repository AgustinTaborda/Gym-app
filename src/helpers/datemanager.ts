import { Injectable } from '@nestjs/common';
import { PeriodType } from '../notificationschedule/entities/notificationschedule.entity';
import { throwError } from 'rxjs';
@Injectable()
export class DateManager{
 
  calculateNextSendDateDay(periodParam: string): Date {
    const actualDate = new Date();
    const hour = parseInt(periodParam.replaceAll('*','').slice(0,2));
    const minute = parseInt(periodParam.replaceAll('*','').slice(2,4));
    const nextSendDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate()+1, hour, minute, 0);
   
   
    return this.formatDateToLocalString(nextSendDate);
  }

  calculateFirstSendDateDay(periodParam: string): Date {
    const actualDate = new Date();
    const hour = parseInt(periodParam.replaceAll('*','').slice(0,2));
    const minute = parseInt(periodParam.replaceAll('*','').slice(2,4));
    const nextSendDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), hour, minute, 0);
   
   
    return this.formatDateToLocalString(nextSendDate);
  }

 calculateNextSendDate =  (periodParam:string,period:PeriodType) : Date =>{


  switch (period) {
    case PeriodType.DAY: return this.calculateNextSendDateDay(periodParam);
    case PeriodType.WEEK: return this.calculateNextSendDateWeekly(periodParam);
    case PeriodType.MONTH: return this.calculateNextSendDateMonthly(periodParam);
    case PeriodType.YEAR: return this.calculateNextSendDateYearly(periodParam);
   // default: return throwError(() => new Error('Invalid period type'));
  }

  }

  

   formatDateToLocalString = (date:Date) =>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11, sumamos 1
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const milliseconds = String(date.getMilliseconds()).padStart(6, '0'); // Añadimos ceros si es necesario
    
    // Construir el formato "YYYY-MM-DD HH:MM:SS.mmmmmm"
    //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
   // return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`);// asi hora utc
   return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`);// asi hora local
  }

  /**
   * 
   * @param hour 
   * @param minute 
   * @returns string 
   * @example if hour = 8 and minute = 00 then result will be '********0800'
   */
   encodeToHourSchedule = (hour : number,minute: number):string =>{

    if (hour > 23 || minute > 59 || hour < 0 || minute < 0) {
        throw new Error('Max hours to 23 and minutes to 59 and no negative numbers');
    }

    let parsedHour = hour.toString();
    let parsedMinute = minute.toString();
    const encoded:string = ''

    if(hour < 10){
        parsedHour = '0'+parsedHour;
    }
    if(minute < 10){
        parsedMinute = '0'+parsedMinute;
    }

    return '********'+parsedHour+parsedMinute;

  }

  calculateNextSendDateWeekly(periodParam: string): Date {
    const dayOfWeek = parseInt(periodParam.substring(0, 2), 10); // Extrae el día de la semana
    const hours = parseInt(periodParam.substring(2, 4), 10);
    const minutes = parseInt(periodParam.substring(4, 6), 10);

    const now = new Date();
    const nextSendDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // Calcula el próximo día de la semana
    const daysUntilNext = (dayOfWeek + 7 - now.getDay()) % 7;
    nextSendDate.setDate(nextSendDate.getDate() + daysUntilNext);

    return nextSendDate;
}

calculateNextSendDateMonthly(periodParam: string): Date {
  const dayOfMonth = parseInt(periodParam.substring(0, 2), 10);
  const hours = parseInt(periodParam.substring(2, 4), 10);
  const minutes = parseInt(periodParam.substring(4, 6), 10);

  const now = new Date();
  const nextSendDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth, hours, minutes);

  // Si el día del próximo envío ya pasó este mes, programa para el próximo mes
  if (now.getDate() > dayOfMonth) {
      nextSendDate.setMonth(nextSendDate.getMonth() + 1);
  }

  return nextSendDate;
}

calculateNextSendDateYearly(periodParam: string): Date {
  const dayOfMonth = parseInt(periodParam.substring(0, 2), 10);
  const month = parseInt(periodParam.substring(2, 4), 10) - 1; // Meses van de 0 a 11
  const hours = parseInt(periodParam.substring(4, 6), 10);
  const minutes = parseInt(periodParam.substring(6, 8), 10);

  const now = new Date();
  const nextSendDate = new Date(now.getFullYear(), month, dayOfMonth, hours, minutes);

  // Si la fecha ya pasó este año, programa para el próximo año
  if (now > nextSendDate) {
      nextSendDate.setFullYear(nextSendDate.getFullYear() + 1);
  }

  return nextSendDate;
}

calculateNextSendDateOnce(periodParam: string): Date {
  const day = parseInt(periodParam.substring(0, 2), 10);
  const month = parseInt(periodParam.substring(2, 4), 10) - 1; // Meses van de 0 a 11
  const year = parseInt(periodParam.substring(4, 8), 10);
  const hours = parseInt(periodParam.substring(8, 10), 10);
  const minutes = parseInt(periodParam.substring(10, 12), 10);

  return new Date(year, month, day, hours, minutes);
}





 

}

