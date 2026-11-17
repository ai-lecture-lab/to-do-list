// localStorage 저장 키
const storage_key = "todo_items";

const todo_form = document.getElementById("todo_form");
const todo_input = document.getElementById("todo_input");
const todo_list = document.getElementById("todo_list");
const empty_message = document.getElementById("empty_message");
const progress_fill = document.getElementById("progress_fill");
const progress_text = document.getElementById("progress_text");
const progress_badge = document.getElementById("progress_badge");
const total_value = document.getElementById("total_value");
const done_value = document.getElementById("done_value");
const remain_value = document.getElementById("remain_value");

// 오늘 날짜 표시 (홈 시계와 같은 형식)
const week_days = ["일", "월", "화", "수", "목", "금", "토"];
const now_date = new Date();
document.getElementById("date_day").textContent = `${now_date.getMonth() + 1}/${now_date.getDate()}`;
document.getElementById("date_text").textContent =
  `${now_date.getFullYear()}년 ${now_date.getMonth() + 1}월 ${now_date.getDate()}일 (${week_days[now_date.getDay()]})`;

// 저장된 할일 목록 불러오기 (실패 시 빈 배열)
function load_todos() {
  try {
    const raw_data = localStorage.getItem(storage_key);
    return raw_data ? JSON.parse(raw_data) : [];
  } catch {
    return [];
  }
}

// 할일 목록 저장하기
function save_todos() {
  try {
    localStorage.setItem(storage_key, JSON.stringify(todo_items));
  } catch {
    // 저장 불가 환경(시크릿 모드 등)에서는 무시
  }
}

let todo_items = load_todos();

// 화면 다시 그리기
function render_todos() {
  todo_list.innerHTML = "";

  todo_items.forEach((todo_item) => {
    const list_item = document.createElement("li");
    list_item.className = "todo_item" + (todo_item.done ? " done" : "");

    const check_box = document.createElement("input");
    check_box.type = "checkbox";
    check_box.checked = todo_item.done;
    check_box.addEventListener("change", () => toggle_todo(todo_item.id));

    const text_span = document.createElement("span");
    text_span.className = "todo_text";
    text_span.textContent = todo_item.text;

    const delete_button = document.createElement("button");
    delete_button.className = "delete_button";
    delete_button.textContent = "✕";
    delete_button.setAttribute("aria-label", "삭제");
    delete_button.addEventListener("click", () => delete_todo(todo_item.id));

    const status_chip = document.createElement("span");
    status_chip.className = "status_chip";
    status_chip.textContent = todo_item.done ? "완료" : "진행 중";

    list_item.append(check_box, text_span, status_chip, delete_button);
    todo_list.appendChild(list_item);
  });

  // 빈 목록 안내와 남은 개수 표시
  const total_count = todo_items.length;
  const done_count = todo_items.filter((todo_item) => todo_item.done).length;
  const remain_count = total_count - done_count;
  empty_message.hidden = total_count > 0;
  total_value.textContent = total_count;
  done_value.textContent = done_count;
  remain_value.textContent = remain_count;

  // 진행률 표시
  const percent_value = total_count ? Math.round((done_count / total_count) * 100) : 0;
  progress_fill.style.width = percent_value + "%";
  progress_badge.textContent = percent_value + "%";
  progress_text.textContent = total_count && !remain_count
    ? "모두 완료했어요! 🎉"
    : `전체 진행률 ${percent_value}%`;
}

// 할일 추가
function add_todo(text_value) {
  todo_items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text: text_value, done: false });
  save_todos();
  render_todos();
}

// 완료 상태 전환
function toggle_todo(todo_id) {
  todo_items = todo_items.map((todo_item) =>
    todo_item.id === todo_id ? { ...todo_item, done: !todo_item.done } : todo_item
  );
  save_todos();
  render_todos();
}

// 할일 삭제
function delete_todo(todo_id) {
  todo_items = todo_items.filter((todo_item) => todo_item.id !== todo_id);
  save_todos();
  render_todos();
}

todo_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text_value = todo_input.value.trim();
  if (!text_value) return;
  add_todo(text_value);
  todo_input.value = "";
  todo_input.focus();
});

render_todos();
