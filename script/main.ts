const ElInputName: HTMLInputElement = document.querySelector('.action__input-name')!;
const ElInputVacancy: HTMLInputElement = document.querySelector('.action__input-vacancy')!;
const ElInputNumber: HTMLInputElement = document.querySelector('.action__input-number')!;
const BtnAdd: HTMLButtonElement = document.querySelector('.action__btn-add')!;
const BtnClear: HTMLButtonElement = document.querySelector('.action__btn-clear')!;
const BtnTitle: NodeListOf<HTMLDivElement> = document.querySelectorAll('.list__column-el');
const ListValue: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.value');
// let myData = JSON.parse(localStorage.getItem('myData')) || [];

const myData: ElObject[] = (() => {
    try {
        const storedData = localStorage.getItem('myData');
        if (storedData) {
            return JSON.parse(storedData) as ElObject[];
        }
        return []; // Возвращаем пустой массив, если данных нет
    } catch (error) {
        console.error('Ошибка при чтении данных из localStorage:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
})();

interface ElObject {
    id: number; 
    Name: string;
    Vacancy: string;
    Number: number | string;
}

interface EditWindowName {
    value: string | undefined;
}

function CheckListValue(): void {
    BtnTitle.forEach(el => { SetListValue(el); }); 
}

BtnAdd.addEventListener('click', function() {
    const ElObj: ElObject | null = ElObjectCreate();
    if (ElObj) {
        const NewDiv = ElementDivCreate(ElObj);
        const List = getListById(ElObj.Name);
        appendToList(List, NewDiv);
        CheckListValue();
        SaveToLocalStorage(ElObj);
    }
});

function saveToLS(key: string, data: ElObject[] | null): void {
    if (data === null) {
        localStorage.removeItem(key);
        return;
    }

    const jsonData = JSON.stringify(data);
    
    try {
        localStorage.setItem(key, jsonData);
    } catch (error) {
        console.error('Произошла ошибка при записи в localStorage:', error);
    }
}

function SaveToLocalStorage(data: ElObject | null): void {
    if(data) {
        myData.push(data);
    }
    saveToLS('myData', myData);
}

function deleteItem(id: number): void {
    const NewData: ElObject[] = myData.filter(item => item.id !== id);
    saveToLS('myData', NewData);
}

function editItem(id: number, updatedItem: ElObject): void {
    const NewData: ElObject[] = myData.map(item => item.id === id ? updatedItem : item);
    saveToLS('myData', NewData);
}

function ElObjectCreate(): ElObject | null {

    const ElObject: ElObject = {
        id: Date.now(),
        Name: ElInputName.value,
        Vacancy: ElInputVacancy.value,
        Number: Number(ElInputNumber.value),
    }

    const isValid: boolean = TextValidate(ElObject);

    if (isValid) {

        ElInputName.value = '';
        ElInputVacancy.value = '';
        ElInputNumber.value = '';

        return ElObject;
    }

    return null;
}

function TextValidate(ElObject: ElObject) {
    let RightState: boolean = true;

    const patternABC = /^[a-zA-Z]+$/; 
    const patternNUM = /^[+]?[0-9]+$/; 

    if (ElObject.Name === "" || !patternABC.test(ElObject.Name)) {
        ElInputName.classList.add('error');
        RightState = false;
    } else {
        ElInputName.classList.remove('error');
    }

    if (ElObject.Vacancy === "" || !patternABC.test(ElObject.Vacancy)) {
        ElInputVacancy.classList.add('error');
        RightState = false;
    } else {
        ElInputVacancy.classList.remove('error');
    }

    if (ElObject.Number === "" || !patternNUM.test(String(ElObject.Number))) {
        ElInputNumber.classList.add('error');
        RightState = false;
    } else {
        ElInputNumber.classList.remove('error');
    }

    return RightState;
}

function ElementDivCreate(data: ElObject) {
    if (!data || !data.Name || !data.Vacancy || !data.Number) {
        console.error('Invalid data:', data);
        return null;
    }

    const NewDiv = document.createElement('div');
    NewDiv.classList.add('element__wrap', 'unvisible');
    
    const NewElName: HTMLParagraphElement = document.createElement('p');
    const NewElVacancy: HTMLParagraphElement = document.createElement('p');
    const NewElNumber: HTMLParagraphElement = document.createElement('p');
    
    NewElName.textContent = `Name: ${data.Name}`;
    NewElVacancy.textContent = `Vacancy: ${data.Vacancy}`;
    NewElNumber.textContent = `Number: ${data.Number}`;
    
    let newInfo: ElObject = {
        id: data.id,
        Name: data.Name,
        Vacancy: data.Vacancy,
        Number: data.Number,
    }

    NewDiv.append(NewElName, NewElVacancy, NewElNumber, addBtnDel(data), addBtnEdit(newInfo, data));
    return NewDiv;
}

function addBtnDel(data: ElObject) {
    const BtnDel: HTMLButtonElement = document.createElement('button');
    BtnDel.classList.add('button', 'btn__delete');
    BtnDel.textContent = 'Del';

    BtnDel.addEventListener('click', function() {
        BtnDel?.parentElement?.remove() || "";
        CheckListValue()
        deleteItem(data.id);
    });

    return BtnDel;
}

function addBtnEdit(NewInfo: ElObject, data: ElObject) {
    const BtnEdit = document.createElement('button');
    BtnEdit.classList.add('button');
    BtnEdit.textContent = 'Edit';

    BtnEdit.addEventListener('click', function() {
        console.log('BtnEdit clicked');
        const EditWindow = document.createElement('div');
        EditWindow.classList.add('element__edit');

        const EditWindowTitle: HTMLParagraphElement = document.createElement('p');
        const EditWindowName: HTMLInputElement = document.createElement('input');
        const EditWindowVacancy: HTMLInputElement = document.createElement('input');
        const EditWindowNum: HTMLInputElement = document.createElement('input');
        const BtnSave: HTMLButtonElement = document.createElement('button');

        EditWindowTitle.textContent = 'Edit element';
        EditWindowName.value = NewInfo.Name;
        EditWindowVacancy.value = NewInfo.Vacancy || '';
        EditWindowNum.value = String(NewInfo.Number) || '';

        EditWindowName.classList.add('element__edit-input');
        EditWindowVacancy.classList.add('element__edit-input');
        EditWindowNum.classList.add('element__edit-input');

        BtnSave.classList.add('button');
        BtnSave.textContent = 'Save';

        EditWindow.append(EditWindowTitle, EditWindowName, EditWindowVacancy, EditWindowNum, BtnSave);

        document.body.appendChild(EditWindow);

        BtnSave.addEventListener('click', function() {
            NewInfo.Name = `Name: ${EditWindowName.value}`;
            NewInfo.Vacancy = `Vacancy: ${EditWindowVacancy.value}`;
            NewInfo.Number = `Number: ${EditWindowNum.value}`;
            EditWindow.classList.remove('element__edit');

            const updatedData: ElObject = {
                id: data.id,
                Name: EditWindowName.value,
                Vacancy: EditWindowVacancy.value,
                Number: Number(EditWindowNum.value)
            };

            editItem(data.id, updatedData);
            

            document.body.removeChild(EditWindow);
            location.reload();
        });
    });

    return BtnEdit;
}

function getListById(name: string) {
    let ElId: string = name.charAt(0);
    if(document.getElementById(String(ElId))) {
        return document.getElementById(String(ElId));
    } else {
        console.log(ElId + "ElId null");
        return null;
    }
}

function appendToList(list: HTMLElement | null, el: HTMLDivElement | null) {
    if(list && el) {
        list.appendChild(el);
    }
}

BtnClear.addEventListener('click', function() {
    removeToList();
});

function removeToList() {
    const elements = document.querySelectorAll(".element__wrap");
    elements.forEach(el => { el.remove(); });
    CheckListValue();
    localStorage.removeItem('myData'); 
    saveToLS('myData', null);
}

function SetListValue(el: Element) {
    const Value: HTMLParagraphElement | null = el.querySelector('.value');
    if (el.children.length <= 1 && Value) {
        Value.textContent = null;
    } else if(Value) {
        Value.textContent = String(el.children.length - 1);
    }
}

BtnTitle.forEach(el => {
    let ListState: number = 0;
    const columnTitle = el.querySelector('.list__column-title');

    if(columnTitle) {
        columnTitle.addEventListener('click', function() {
            if (ListState === 0) {
                const children = el.querySelectorAll(':scope > .element__wrap');
                children.forEach(child => {
                    child.classList.remove('unvisible');
                });
                ListState = 1;
                SetListValue(el);
            } else {
                const children = el.querySelectorAll(':scope > .element__wrap');
                children.forEach(child => {
                    child.classList.add('unvisible');
                });
                ListState = 0;
                SetListValue(el);
            }
            console.log('ListState after:', ListState);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    myData.forEach(data => {
        const NewDiv = ElementDivCreate(data);
        if (NewDiv) {
            const List = getListById(data.Name);
            appendToList(List, NewDiv);
        }
    });
    CheckListValue();
    console.log('Data loaded from localStorage:', myData);
})
