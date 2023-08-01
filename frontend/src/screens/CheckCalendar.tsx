import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Calendar } from 'react-native-calendars';
import MonthPicker from 'react-native-month-year-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { userState } from '../state/atoms/userAtom';
import { getFormattedDate } from '../utils/formattedDate';
import Plus from '../assets/images/common/plus.svg';
import CheckCalendarDayComponent from '../components/plan/CheckCalendarDayComponent';
import {
  CalendarProps,
  DayType,
  SchedulesType,
} from '../types/calendar/calendarType';
import { partnerState } from '../state/atoms/partnerAtom';
import OptionArrow from '../assets/images/common/optionArrow.svg';
import CheckCalendarDetail from '../components/plan/CheckCalendarDetail';
import { month } from '../utils/plan/calendarText';
import {
  handleCheckAnniversaryList,
  handleCheckPlan,
} from '../utils/plan/calendar';
import { coupleState } from '../state/atoms/coupleAtom';
import { modeState } from '../state/atoms/creatModeAtom';

const CheckCalendar = ({
  navigation,
  detail,
  setDaySelected,
}: CalendarProps) => {
  const userData = useRecoilValue(userState);
  const partnerData = useRecoilValue(partnerState);
  const coupleData = useRecoilValue(coupleState);
  const today = getFormattedDate(new Date());
  const [focus, setFocus] = useState(false);
  const [selected, setSelected] = useState(today);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [anniversaryList, setAnniversaryList] = useState([]);
  const addPlanData = [
    ['데이트', '#FC887B'],
    ['내 일정', '#FFDD95'],
  ];
  const [selectedFilter, setSelectedFilter] = useState(0);
  const currentYear = today.substring(0, 4);
  const currentMonth = today.substring(5, 7);
  const currentDay = today.substring(8, 10);
  const selectedYear = selected.substring(0, 4);
  const selectedMonth = selected.substring(5, 7);
  const selectedDay = selected.substring(8, 10);
  const formattedDate = getFormattedDate(date);
  const setCreateMode = useSetRecoilState(modeState);

  const schedules: SchedulesType[] = [];

  let newDaysObject: DayType = {};

  // 날짜 선택 및 전달
  const handleSelectedDate = (date: SetStateAction<string>) => {
    setSelected(date);
    if (setDaySelected) {
      setDaySelected(date);
    }
  };

  // 년도, 월 세팅하는 모달 보이게하는 함수
  const handleShowPicker = useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => setShow(value),
    []
  );

  // 숫자로 들어오는 월 이름을 영어로 바꾸는 함수
  const handleMonthName = useCallback((date: Date) => {
    const index = date.getMonth();
    return month[index];
  }, []);

  // 년도, 월을 변경할 때 사용하는 함수
  const handleChangeValue = useCallback(
    (event: any, newDate: Date) => {
      const selectedDate = newDate || date;
      const formattedDate = getFormattedDate(selectedDate);

      handleShowPicker(false);
      setDate(selectedDate);
      formattedDate.substring(0, 7) === selected.substring(0, 7) && selected
        ? setSelected(selected)
        : formattedDate.substring(0, 7) === today.substring(0, 7)
        ? setSelected(today)
        : setSelected(formattedDate);
      handleMonthName(date);
    },
    [date, handleMonthName, handleShowPicker, selected, today]
  );

  for (let i = 0; i < scheduleList.length; i++) {
    schedules.push({
      [scheduleList[i].date]: [],
    });
    for (let j = 0; j < scheduleList[i].events.length; j++) {
      schedules[i][scheduleList[i].date].push({
        key: scheduleList[i].events[j],
        color: 'white',
      });
    }
  }

  for (let i = 0; i < schedules.length; i++) {
    newDaysObject = {
      ...newDaysObject,
      [Object.keys(schedules[i])[0]]: {
        marked: true,
        dots: Object.values(schedules[i])[0],
      },
    };
  }

  // 일정 추가 페이지로 넘어가기
  const handleAddPlan = (mode: string) => {
    setCreateMode(mode);
    navigation.navigate('PlanRoute');
  };

  useEffect(() => {
    const year = selectedYear || currentYear;
    const month = selectedMonth || currentMonth;
    const day = selectedDay || currentDay;
    const myMemberId = userData.memberId;
    const { coupleId } = coupleData;

    handleCheckPlan({ year, month, myMemberId, setScheduleList });
    handleCheckAnniversaryList({
      year,
      month,
      day,
      coupleId,
      setAnniversaryList,
    });
  }, [
    coupleData,
    currentDay,
    currentMonth,
    currentYear,
    partnerData,
    selected,
    selectedDay,
    selectedMonth,
    selectedYear,
    today,
    userData.memberId,
    focus,
  ]);

  const marginContainerStyle = {
    ...styles.marginContainer,
    flex: detail ? 0 : 1,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={marginContainerStyle}>
        <View style={detail ? undefined : styles.calendarView}>
          {/* 플랜 생성 페이지 분기처리 */}
          {detail ? (
            <View style={styles.calendarHeaderView}>
              <TouchableOpacity
                activeOpacity={1.0}
                style={styles.textFlex}
                onPress={() => handleShowPicker(true)}
              >
                <Text style={styles.detailText}>{date.getFullYear()}</Text>
                <Text style={styles.detailText}>{handleMonthName(date)}</Text>
                <OptionArrow />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.calendarHeaderView}>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => handleShowPicker(true)}
              >
                <Text style={styles.yearText}>{date.getFullYear()}</Text>
                <Text style={styles.monthText}>{handleMonthName(date)}</Text>
              </TouchableOpacity>
              <View style={styles.dropdownContainerView}>
                <SelectDropdown
                  data={addPlanData}
                  dropdownOverlayColor="none"
                  buttonStyle={styles.dropdownButtonView}
                  buttonTextStyle={styles.dropdownButtonText}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <Plus
                        style={{
                          transform: [{ rotate: isOpened ? '45deg' : '0deg' }],
                          marginRight: -10,
                        }}
                      />
                    );
                  }}
                  dropdownStyle={styles.dropdownBelowContainerView}
                  renderCustomizedRowChild={(item) => {
                    return (
                      <View style={styles.rowChildView}>
                        <View
                          style={{
                            ...styles.circleView,
                            backgroundColor: item[1],
                          }}
                        />
                        <Text>{item[0]}</Text>
                      </View>
                    );
                  }}
                  rowTextStyle={styles.rowChildText}
                  rowStyle={styles.rowDividerView}
                  onSelect={(selectedItem, index) => {
                    setSelectedFilter(index);
                    index === 0 ? handleAddPlan('date') : handleAddPlan('plan');
                  }}
                  buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem[0];
                  }}
                  rowTextForSelection={(item) => {
                    return item[0];
                  }}
                />
              </View>
            </View>
          )}

          {/* 캘린더 주간 제목 색상 및 대문자 설정 아직 구현 못함 */}
          <Calendar
            monthFormat=""
            current={formattedDate}
            key={formattedDate}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            markingType="multi-dot"
            hideArrows
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
            markedDates={newDaysObject}
            dayComponent={({ date, state, marking }) => {
              return (
                <CheckCalendarDayComponent
                  detail={detail}
                  date={date}
                  state={state}
                  marking={marking}
                  setSelected={(date) => handleSelectedDate(date)}
                  selected={selected}
                />
              );
            }}
          />

          {detail ? null : (
            <CheckCalendarDetail
              navigation={navigation}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              currentMonth={currentMonth}
              currentDay={currentDay}
              anniversaryList={anniversaryList}
              setFocus={setFocus}
            />
          )}
        </View>

        {/* picker main 페이지와 생성/수정 페이지 스타일 분기 */}
        <View style={{ right: detail ? 30 : 0 }}>
          {show && (
            <MonthPicker
              onChange={handleChangeValue}
              value={date}
              minimumDate={new Date(1990, 1)}
              maximumDate={new Date(2025, 5)}
              locale="en"
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CheckCalendar;

const styles = StyleSheet.create({
  marginContainer: {
    paddingTop: 8,
  },
  calendarView: {
    marginLeft: 21,
    marginRight: 21,
  },
  calendarHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yearText: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '400',
    fontSize: 14,
    color: '#000000',
  },
  monthText: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '700',
    fontSize: 32,
    color: '#000000',
    textTransform: 'uppercase',
  },
  plusButton: {
    paddingTop: 13,
  },
  selectedDateText: {
    marginTop: 24,
    fontFamily: 'Pretendard-Medium',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'left',
    color: '#000000',
  },

  // 해당 부분은 일정 생성 페이지 캘린더 UI 스타일 분기 코드
  detailText: {
    fontWeight: '500',
    fontSize: 18,
    color: '#787878',
    fontFamily: 'Pretendard-Medium',
    marginRight: 5,
    textTransform: 'uppercase',
  },
  textFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownContainerView: {
    flexDirection: 'row',
    height: 19,
    marginTop: 14,
  },
  dropdownButtonView: {
    backgroundColor: '#FFFFFF',
    width: 120,
  },
  dropdownButtonText: {
    display: 'none',
  },
  dropdownBelowContainerView: {
    width: 120,
    height: 64,
    borderBottomColor: '#FFFFFF',
    marginTop: -8,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 6,
      height: 4,
    },
    shadowColor: '#000000',
    borderColor: 'rgba(22,20,10,0.1)',
    overflow: 'visible',
    borderRadius: 8,
  },
  rowChildView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 23,
  },
  circleView: {
    height: 12,
    width: 12,
    borderRadius: 1000,
    marginRight: 12,
  },
  rowChildText: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '400',
    fontSize: 14,
    marginLeft: 23,
    textAlign: 'left',
    color: '#000000',
  },
  rowDividerView: {
    height: 32,
    borderBottomColor: '#EDF0F3',
  },
});
