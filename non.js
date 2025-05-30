document.addEventListener('DOMContentLoaded', () => {
    // 필요한 HTML 요소들을 모두 가져옴
    const h1Title = document.querySelector('.container h1'); // 제목 요소 가져오기
    const daySelect = document.getElementById('day-select'); // 요일 선택 드롭다운
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');

    // ⭐ 할 일 데이터를 요일별로 저장할 객체 (이건 그대로 둬야 요일별로 관리돼!)
    // 각 요일 키에 할 일 목록(배열)을 저장
    // 각 할 일은 { text: '할 일 내용', completed: false } 형태로 저장
    let tasksByDay = {
        '월': [],
        '화': [],
        '수': [],
        '목': [],
        '금': [],
        '토': [],
        '일': []
    };

    // ⭐ 현재 선택된 요일을 추적하는 변수
    let currentDay = daySelect.value; // 초기값은 드롭다운의 기본 선택값 (월요일)

    // ⭐ 선택된 요일에 따라 할 일 목록을 화면에 그려주는 함수
    function renderTasks(day) {
        // 현재 목록 비우기
        todoList.innerHTML = '';
        // 제목 업데이트
        h1Title.textContent = `${day}요일 할 일`; // 이건 요일 표시 그대로!

        // 선택된 요일의 할 일 목록 가져오기
        const tasks = tasksByDay[day];

        // 할 일 목록이 비어있지 않으면
        if (tasks && tasks.length > 0) {
            // 각 할 일에 대해 리스트 항목(li) 생성
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                // 할 일이 완료 상태면 'completed' 클래스 추가
                if (task.completed) {
                    li.classList.add('completed');
                }

                // ⭐ 요일 표시 span은 이제 만들지 않아요!

                // ⭐ 할 일 텍스트 span 생성
                const taskTextSpan = document.createElement('span');
                taskTextSpan.textContent = task.text; // 할 일 텍스트 설정
                taskTextSpan.classList.add('todo-text'); // CSS 스타일은 그대로 적용!


                // 삭제 버튼 생성
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '❌';
                // 삭제 버튼 클릭 이벤트
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // 이벤트 버블링 막기
                    // ⭐ 해당 요일의 tasksByDay 배열에서 해당 항목 제거
                    tasksByDay[day].splice(index, 1);
                    // ⭐ 목록 다시 그리기 (삭제된 항목이 반영되도록)
                    renderTasks(day);
                });

                // ⭐ 리스트 항목 (li) 클릭 이벤트 (완료/미완료 토글)
                li.addEventListener('click', () => {
                    // ⭐ tasksByDay 데이터에서 해당 항목의 completed 상태 토글
                    tasksByDay[day][index].completed = !tasksByDay[day][index].completed;
                    // ⭐ li 요소에 'completed' 클래스 토글 (화면 표시 업데이트)
                    li.classList.toggle('completed');
                });


                // ⭐ li에 요소들 추가: 요일 span 빼고 할 일 텍스트 span과 삭제 버튼만!
                li.appendChild(taskTextSpan);
                li.appendChild(deleteButton);

                // todoList에 li 추가
                todoList.appendChild(li);
            });
        } else {
             // 해당 요일에 할 일이 없을 경우 메시지 표시
             const li = document.createElement('li');
             li.textContent = '오늘 할 일이 없어요! 😊';
             li.style.justifyContent = 'center'; // 가운데 정렬
             li.style.fontStyle = 'italic'; // 기울임꼴
             li.style.color = '#888'; // 색상 연하게
             todoList.appendChild(li);
        }
    }

    // ⭐ '추가' 버튼 클릭 또는 Enter 키 입력 시 할 일 추가 함수 (이건 그대로!)
    function addTodo() {
        const todoText = todoInput.value.trim(); // 입력 텍스트
        const selectedDay = daySelect.value; // ⭐ 선택된 요일

        if (todoText !== '') {
            // ⭐ tasksByDay 객체에서 선택된 요일 배열에 새로운 할 일 추가
            // completed 상태는 기본값으로 false
            tasksByDay[selectedDay].push({ text: todoText, completed: false });

            // 입력창 비우기
            todoInput.value = '';
            // 입력창에 다시 포커스
            todoInput.focus();

            // ⭐ 현재 보고 있는 요일과 추가한 요일이 같으면 목록 바로 업데이트
            // 다른 요일에 추가한 경우는 목록을 바로 업데이트할 필요 없음
            if (selectedDay === currentDay) {
                 renderTasks(currentDay);
            } else {
                 // 다른 요일에 추가했음을 사용자에게 알리는 등의 추가적인 피드백을 줄 수 있음
                 console.log(`${selectedDay}에 "${todoText}" 할 일이 추가되었습니다.`);
                 alert(`${selectedDay}에 "${todoText}" 할 일이 추가되었습니다.`); // 간단한 알림
            }
        }
    }

    // '추가' 버튼 클릭 이벤트
    addButton.addEventListener('click', addTodo);

    // 입력창에서 Enter 키 눌렀을 때 이벤트
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addTodo();
        }
    });

    // ⭐ 요일 선택 드롭다운 변경 이벤트
    daySelect.addEventListener('change', (event) => {
        currentDay = event.target.value; // ⭐ 현재 선택된 요일 업데이트
        renderTasks(currentDay); // ⭐ 변경된 요일의 할 일 목록 그리기
    });

    // ⭐ 페이지 로드 시 초기 목록 그리기 (기본값: 월요일)
    renderTasks(currentDay);

    // (선택 사항) localStorage를 이용해 데이터를 브라우저에 저장하고 불러오는 기능 추가
    // 이렇게 하면 페이지를 닫았다 열어도 데이터가 유지돼!
    // 필요하면 나중에 이 기능도 알려줄 수 있어!
});
