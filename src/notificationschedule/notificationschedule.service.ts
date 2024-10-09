import { Inject, Injectable } from '@nestjs/common';
import { dailyNotificationDto } from './dto/daily.dto.notification';
import { WeeklyNotificationDto } from './dto/weekly.dto.notification';
import { MonthlyNotificationDto } from './dto/monthly.dto.notification';
import { YearlyNotificationDto } from './dto/yearly.dto.notification';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationscheduleEntity } from './entities/notificationschedule.entity';
import { UserEntity } from '../users/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { PeriodType } from './entities/notificationschedule.entity';
import { DateManager} from '../helpers/datemanager'



@Injectable()
export class NotificationscheduleService {
  constructor(
    @InjectRepository(NotificationscheduleEntity) 
    private readonly notificationScheduleRepository: Repository<NotificationscheduleEntity>,
   
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageEntityRepository: Repository<MessageEntity>,
    private readonly dateManager:DateManager
) {}
async createYearly(createYearlyNotificationscheduleDto: YearlyNotificationDto) {
  const user: UserEntity = await this.userEntityRepository.findOneBy({ id: createYearlyNotificationscheduleDto.userId });
  const message: MessageEntity = await this.messageEntityRepository.findOneBy({ id: createYearlyNotificationscheduleDto.messageId });

  const encodedDate = this.dateManager.encodeToYearSchedule(
      createYearlyNotificationscheduleDto.dateOfmonth,
      createYearlyNotificationscheduleDto.monthNumber,
      createYearlyNotificationscheduleDto.hour,
      createYearlyNotificationscheduleDto.minute
  );
  
  const nextSendDate = this.dateManager.calculateNextSendDateYearly(encodedDate);

  const yearlyNotification = this.notificationScheduleRepository.create({
      user: user,
      message: message,
      nextSendDate: nextSendDate,
      periodParam: encodedDate,
      periodType: PeriodType.YEAR,
      sended: false,
  });

  return await this.notificationScheduleRepository.save(yearlyNotification);
}

async createMonthly(createMonthlyNotificationscheduleDto: MonthlyNotificationDto) {
  const user: UserEntity = await this.userEntityRepository.findOneBy({ id: createMonthlyNotificationscheduleDto.userId });
  const message: MessageEntity = await this.messageEntityRepository.findOneBy({ id: createMonthlyNotificationscheduleDto.messageId });

  const encodedDate = this.dateManager.encodeToMonthSchedule(
      createMonthlyNotificationscheduleDto.dateOfmonth,
      createMonthlyNotificationscheduleDto.hour,
      createMonthlyNotificationscheduleDto.minute
  );

  const nextSendDate = this.dateManager.calculateNextSendDateMonthly(encodedDate);

  const monthlyNotification = this.notificationScheduleRepository.create({
      user: user,
      message: message,
      nextSendDate: nextSendDate,
      periodParam: encodedDate,
      periodType: PeriodType.MONTH,
      sended: false,
  });

  return await this.notificationScheduleRepository.save(monthlyNotification);
}

async createWeekly(createNotificationscheduleDto: WeeklyNotificationDto) {
  const user: UserEntity = await this.userEntityRepository.findOneBy({ id: createNotificationscheduleDto.userId });
  const message: MessageEntity = await this.messageEntityRepository.findOneBy({ id: createNotificationscheduleDto.messageId });

  const encodedDate = this.dateManager.encodeToWeekSchedule(
      createNotificationscheduleDto.dayOfweek,
      createNotificationscheduleDto.hour,
      createNotificationscheduleDto.minute
  );

  const nextSendDate = this.dateManager.calculateNextSendDateWeekly(encodedDate);

  const weeklyNotification = this.notificationScheduleRepository.create({
      user: user,
      message: message,
      nextSendDate: nextSendDate,
      periodParam: encodedDate,
      periodType: PeriodType.WEEK,
      sended: false,
  });

  console.log(weeklyNotification);
  return await this.notificationScheduleRepository.save(weeklyNotification);
}

  async createDaily(createdailyNotificationDto: dailyNotificationDto) {
   
    const user:UserEntity = await this.userEntityRepository.findOneBy({id:createdailyNotificationDto.userId})
    const message: MessageEntity = await this.messageEntityRepository.findOneBy({id:createdailyNotificationDto.messageId})
   
    createdailyNotificationDto.hour
    createdailyNotificationDto.minute

    const encodedHour = this.dateManager.encodeToHourSchedule(createdailyNotificationDto.hour,createdailyNotificationDto.minute)
    const nextSendDate = this.dateManager.calculateFirstSendDateDay(encodedHour);
   
    const dailyNotification = this.notificationScheduleRepository.create({
      user:user,
      message:message,
      nextSendDate:nextSendDate,
      periodParam:encodedHour,
      periodType: PeriodType.DAY,
      sended:false

    } );


    return await this.notificationScheduleRepository.save(dailyNotification);
  
  }



  findAll() {
    return `This action returns all notificationschedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificationschedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationschedule`;
  }
}