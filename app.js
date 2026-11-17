// localStorage 저장 키
const storage_key = "todo_items";

const todo_form = document.getElementById("todo_form");
const todo_input = document.getElementById("todo_input");
const todo_list = document.getElementById("todo_list");
const empty_message = document.getElementById("empty_message");
const count_label = document.getElementById("count_label");

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

    list_item.append(check_box, text_span, delete_button);
    todo_list.appendChild(list_item);
  });

  // 빈 목록 안내와 남은 개수 표시
  const remain_count = todo_items.filter((todo_item) => !todo_item.done).length;
  empty_message.hidden = todo_items.length > 0;
  count_label.textContent = todo_items.length ? `남은 할일 ${remain_count}개` : "";
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
