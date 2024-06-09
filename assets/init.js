document.addEventListener('DOMContentLoaded', function() {

    console.log("JavaScript is loaded and running.");  // 확인용 로그 메시지
    const options = document.querySelectorAll('.option');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const mannequin = document.getElementById('mannequin');
    const descriptionBox = document.getElementById('description-box');
    const descriptionContent = document.getElementById('description-content');
    const saveButton = document.getElementById('save-button');
    const closeButton = document.getElementById('close-button');
    const selectedOptions = {}; // 각 탭별로 선택된 옵션을 저장할 객체

    const zIndexMap = {
        wall: -2,
        skin: 0,
        eyes: 1,
        tattoo: 2,
        piercing: 3,
        hair: 20,
        bottom: 4,
        skirt: 11,
        pants: 10,
        leggings: 5,
        shorts: 12,
        top: 6,
        onepiece: 13,
        shoe: 7,
        outer: 14,
        knit: 15,
        acc: 21,
        jewelry: 22,
        glasses: 30,
        bag: 23,
        hat: 24,
        etc: 25,
    };

    options.forEach(option => {
        option.addEventListener('click', function() {
            const type = this.dataset.type;
            const subtype = this.dataset.subtype; // 하위 카테고리 가져오기
            const characterSrc = this.dataset.characterSrc;
            const tab = this.closest('.tab-content').id;
            const description = this.getAttribute('data-description');

            // 하위 카테고리별로 선택된 옵션을 관리
            if (!selectedOptions[type]) {
                selectedOptions[type] = {};
            }

            // base, acc, bottom은 중복 선택 가능, 나머지는 불가능
            if (type === 'base' || type === 'acc' || type === 'bottom') {
                // 같은 하위 카테고리 내에서 중복 선택 방지
                if (selectedOptions[type][subtype] === this) {
                    selectedOptions[type][subtype].classList.remove('selected');
                    selectedOptions[type][subtype] = null;
                    resetCharacterPart(type, subtype);
                } else {
                    if (selectedOptions[type][subtype]) {
                        selectedOptions[type][subtype].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    selectedOptions[type][subtype] = this;
                    changeCharacterAppearance(type, subtype, characterSrc);
                }
            } else {
                // 다른 타입들은 하나만 선택 가능
                for (let st in selectedOptions[type]) {
                    if (selectedOptions[type][st]) {
                        selectedOptions[type][st].classList.remove('selected');
                        resetCharacterPart(type, st);
                        selectedOptions[type][st] = null;
                    }
                }
                this.classList.add('selected');
                selectedOptions[type][subtype] = this;
                changeCharacterAppearance(type, subtype, characterSrc);
            }

            // 설명 박스를 표시
            if (description) {
                descriptionContent.innerHTML = description;
                descriptionBox.style.display = 'block';
            }
        });
    });

    closeButton.addEventListener('click', function() {
        descriptionBox.style.display = 'none';
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');

            // 기본 활성화된 하위 탭 설정
            const subTabs = document.querySelectorAll(`#${tabId} .sub-tab-link`);
            const subTabContents = document.querySelectorAll(`#${tabId} .sub-tab-content`);
            const defaultSubTab = document.querySelector(`#${tabId} .sub-tab-link.active`);
            if (subTabs.length > 0 && !defaultSubTab) {
                subTabs[0].classList.add('active');
                subTabContents[0].classList.add('active');
            }
        });
    });

    document.getElementById('reset-button').addEventListener('click', resetCharacter);

    document.getElementById('save-button').addEventListener('click', function() {
        console.log("Save button clicked");  // 저장 버튼 클릭 확인
        html2canvas(document.querySelector('.character')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'character.png';
            link.click();
        });
    });

    function changeCharacterAppearance(type, subtype, src) {
        let elementId = `character-${type}-${subtype}`;
        let element = document.getElementById(elementId);
        if (!element) {
            element = document.createElement('img');
            element.id = elementId;
            element.classList.add('character-part');
            mannequin.parentElement.appendChild(element);
        }
        element.src = src;

        // 하위 카테고리에 맞춰 z-index 설정
        element.style.zIndex = zIndexMap[subtype] || zIndexMap[type];
    }

    function resetCharacterPart(type, subtype) {
        const elementId = `character-${type}-${subtype}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.remove();
        }
    }

    function resetCharacter() {
        const characterParts = document.querySelectorAll('.character-part');
        characterParts.forEach(part => part.remove());
        for (const type in selectedOptions) {
            for (const subtype in selectedOptions[type]) {
                if (selectedOptions[type][subtype]) {
                    selectedOptions[type][subtype].classList.remove('selected');
                    selectedOptions[type][subtype] = null;
                }
            }
        }
    }

    // 하위 탭 관련 코드
    const subTabs = document.querySelectorAll('.sub-tab-link');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabs.forEach(subTab => {
        subTab.addEventListener('click', function() {
            const subTabId = this.dataset.subtab;
            const parentTabContent = this.closest('.tab-content');
            const parentSubTabs = parentTabContent.querySelectorAll('.sub-tab-link');
            const parentSubTabContents = parentTabContent.querySelectorAll('.sub-tab-content');

            parentSubTabs.forEach(tab => tab.classList.remove('active'));
            parentSubTabContents.forEach(content => content.classList.remove('active'));

            document.getElementById(subTabId).classList.add('active');
            this.classList.add('active');
        });
    });

    // 기본 활성화된 하위 탭 설정
    const defaultSubTab = document.querySelector('.sub-tab-link.active');
    if (defaultSubTab) {
        const defaultSubTabId = defaultSubTab.dataset.subtab;
        document.getElementById(defaultSubTabId).classList.add('active');
    }

    // 기본 활성화된 탭 설정
    const defaultTab = document.querySelector(".tab-link[data-tab='base']");
    const defaultContent = document.querySelector("#base");
    setActiveTab(defaultTab, defaultContent);

    function setActiveTab(tab, content) {
        document.querySelectorAll(".tab-link").forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        content.classList.add('active');

        // 기본 활성화된 하위 탭 설정
        const subTabs = content.querySelectorAll('.sub-tab-link');
        const subTabContents = content.querySelectorAll('.sub-tab-content');
        const defaultSubTab = content.querySelector('.sub-tab-link.active');
        if (subTabs.length > 0 && !defaultSubTab) {
            subTabs[0].classList.add('active');
            subTabContents[0].classList.add('active');
        }
    }

    document.querySelectorAll(".tab-link").forEach(tab => {
        tab.addEventListener("click", function() {
            const targetContent = document.querySelector(`#${tab.dataset.tab}`);
            setActiveTab(tab, targetContent);
        });
    });
});
