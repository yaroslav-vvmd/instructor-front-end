let token = null;

const getSendPulseAuthToken = async () => {
    const apiUrl = "https://instructor-back-end.vercel.app";

    try {
        const resp = await fetch(`${apiUrl}/sendpulse-token`, {
            credentials: "include",
        });

        const data = await resp.json();
        token = `${data.token_type} ${data.access_token}`;
    } catch (error) {
        console.error(error);
    }
};

getSendPulseAuthToken();

document.addEventListener("DOMContentLoaded", function () {
    const servicesContainer = document.querySelector(".instructor_services");
    if (!servicesContainer) return; // Exit if the container isn't found

    const serviceItems = Array.from(servicesContainer.children);

    serviceItems.sort((a, b) => {
        return a.getAttribute("data-order") - b.getAttribute("data-order");
    });

    serviceItems.forEach(item => servicesContainer.appendChild(item));
});

document.addEventListener("DOMContentLoaded", function () {
    const instructorSocial = document.querySelector('.instructor_social');

    const allChildrenInvisible = Array.from(instructorSocial.children).every(child =>
        child.classList.contains('w-condition-invisible')
    );

    if (allChildrenInvisible) {
        instructorSocial.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const instructorText = document.querySelector(".instructor_description-text");
    const limit = instructorText.getAttribute('data-limit');
    const originalText = instructorText.innerHTML;

    function truncateHTML(html, limit) {
        let div = document.createElement('div');
        div.innerHTML = html;

        let truncatedHTML = '';
        let charCount = 0;

        function truncateNode(node) {
            if (charCount >= limit) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const remainingChars = limit - charCount;
                if (node.nodeValue.length > remainingChars) {
                    truncatedHTML += node.nodeValue.substring(0, remainingChars);
                    charCount = limit;
                } else {
                    truncatedHTML += node.nodeValue;
                    charCount += node.nodeValue.length;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.nodeName.toLowerCase();

                truncatedHTML += `<${tagName}`;
                for (let attr of node.attributes) {
                    truncatedHTML += ` ${attr.name}="${attr.value}"`;
                }
                truncatedHTML += '>';

                for (let child of node.childNodes) {
                    truncateNode(child);
                    if (charCount >= limit) break;
                }

                truncatedHTML += `</${tagName}>`;
            }
        }

        for (let child of div.childNodes) {
            truncateNode(child);
            if (charCount >= limit) break;
        }

        return truncatedHTML;
    }

    function appendReadMoreButton(truncatedText) {
        const div = document.createElement('div');
        div.innerHTML = truncatedText;

        let lastElement = div.lastChild;

        if (lastElement && lastElement.nodeType === Node.ELEMENT_NODE) {
            const tagName = lastElement.nodeName.toLowerCase();

            if (tagName === 'ul' || tagName === 'ol') {
                let lastListItem = lastElement.lastElementChild;
                if (lastListItem) {
                    lastListItem.innerHTML += `<span id="dots">...</span><span id="readMoreBtn" class="instructor_read-more">Показати більше</span>`;
                }
            } else {
                lastElement.innerHTML += `<span id="dots">...</span><span id="readMoreBtn" class="instructor_read-more">Показати більше</span>`;
            }
        } else if (lastElement.nodeType === Node.TEXT_NODE) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = lastElement.textContent + `<span id="dots">...</span><span id="readMoreBtn" class="instructor_read-more">Показати більше</span>`;
            div.replaceChild(wrapper, lastElement);
        }

        return div.innerHTML;
    }

    const truncatedText = truncateHTML(originalText, limit);
    const textLength = (originalText.replace(/<[^>]+>/g, '')).length;

    if (textLength > limit) {
        const finalTruncatedText = appendReadMoreButton(truncatedText);
        instructorText.innerHTML = finalTruncatedText;

        const readMoreBtn = document.getElementById("readMoreBtn");
        let isExpanded = false;

        readMoreBtn.addEventListener("click", () => {
            if (!isExpanded) {
                instructorText.innerHTML = originalText + `<span class="instructor_read-more" id="readMoreBtn" style="margin-left: 0;">Показати менше</span>`;
                isExpanded = true;
            } else {
                instructorText.innerHTML = finalTruncatedText;
                isExpanded = false;
            }
            attachListener();
        });

        function attachListener() {
            const newReadMoreBtn = document.getElementById("readMoreBtn");
            newReadMoreBtn.addEventListener("click", () => {
                if (!isExpanded) {
                    instructorText.innerHTML = originalText + `<span id="readMoreBtn" class="instructor_read-more" style="margin-left: 0;">Показати менше</span>`;
                    isExpanded = true;
                } else {
                    instructorText.innerHTML = finalTruncatedText;
                    isExpanded = false;
                }
                attachListener();
            });
        }
    } else {
        instructorText.innerHTML = originalText;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const slug = document.body.getAttribute('data-slug');
    const type = 'autoschool';
    const testimonialName = document.querySelector('.instructor_name').textContent;
    let cmsItemId;
    let testimonials = [];
    let currentIndex = 0;
    const testimonialsToShow = 3;

    if (slug) {
        fetch(`https://instructor-backend.vercel.app/api/cms-item/${type}/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.item.id) {
                    cmsItemId = data.item.id;
                    fetchTestimonials(cmsItemId, type);

                    const form = document.getElementById('testimonial-form');
                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        document.querySelector("#testimonial-modal").classList.remove("visible");

                        const userId = localStorage.getItem('uid');

                        const userData = localStorage.getItem('userData')
                            ? JSON.parse(localStorage.getItem('userData'))
                            : null;

                        const firstName = userData.firstName;
                        const lastName = userData.lastName;

                        const overallRating = form.querySelector('input[name="main-rating"]:checked').value;
                        const qualityOfEducation = form.querySelector('input[name="quality-of-education"]:checked').value;
                        const instructorAttitude = form.querySelector('input[name="attitude-of-the-instructor"]:checked').value;
                        const carCondition = form.querySelector('input[name="car-condition"]:checked').value;
                        const reviewText = form.querySelector('textarea[name="textarea"]').value;

                        const testimonialData = {
                            cmsItemId: cmsItemId,
                            type: type,
                            overallRating: overallRating,
                            qualityOfEducation: qualityOfEducation,
                            instructorAttitude: instructorAttitude,
                            carCondition: carCondition,
                            text: reviewText,
                            userId: userId,
                            firstName: firstName,
                            lastName: lastName,
                            testimonialName: testimonialName
                        };

                        fetch('https://instructor-backend.vercel.app/api/testimonials', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(testimonialData)
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.message) {
                                    form.reset();
                                    fetchTestimonials(cmsItemId, type);
                                    fetch("https://events.sendpulse.com/events/name/insructor_review_school", {
                                        method: "POST",
                                        headers: {
                                            "Authorization": token,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            email: "artur@71.in.ua",
                                            phone: "+123456789",
                                            user_fname: firstName,
                                            user_lname: lastName,
                                            review_rate: overallRating,
                                            review_text: reviewText,
                                            review_r1: qualityOfEducation,
                                            review_r2: instructorAttitude,
                                            review_r3: carCondition,
                                        })
                                    })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error(`HTTP error! status: ${response.status}`);
                                            }
                                            return response.json();
                                        })
                                        .then(responseData => {
                                            console.log("Response Data:", responseData);
                                        })
                                        .catch(error => {
                                            alert('Не вдалось надіслати відгук на вебхук')
                                            console.error("Error:", error);
                                        });
                                } else {
                                    console.error('Error submitting testimonial:', data.error);
                                }
                            })
                            .catch(error => {
                                console.error('Error submitting testimonial:', error);
                            });
                    });
                } else {
                    console.error('CMS Item not found:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching CMS item by slug:', error);
            });
    }

    function fetchTestimonials(cmsItemId, type) {
        fetch(`https://instructor-backend.vercel.app/api/testimonials/${cmsItemId}/${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 404) {
                    throw new Error('No testimonials found');
                }
                return response.json();
            })
            .then(data => {
                testimonials = data.testimonials.reverse();
                if (!testimonials.length) return;
                currentIndex = 0;

                const userId = localStorage.getItem('uid');

                const testimonialsAmount = document.querySelector('.testimonials_amount');
                const rateElement = document.querySelector('.instructor-content_head-rate');
                const totalElement = document.querySelector('.instructor-content_head-number');
                const empty1 = document.querySelectorAll('.instructor-content_head-empty')[0];
                const empty2 = document.querySelectorAll('.instructor-content_head-empty')[1];

                function getWordForm(count) {
                    if (count % 100 >= 11 && count % 100 <= 14) {
                        return 'відгуків';
                    }
                    switch (count % 10) {
                        case 1:
                            return 'відгук';
                        case 2:
                        case 3:
                        case 4:
                            return 'відгуки';
                        default:
                            return 'відгуків';
                    }
                }

                const count = testimonials.length;
                const wordElement = document.querySelector('.instructor-content_head-total');

                if (count === 0) {
                    wordElement.style.display = 'none'; т
                } else {
                    wordElement.style.display = '';
                    wordElement.textContent = getWordForm(count);
                }

                const VISIBLE_CLASS = 'visible';
                const HIDDEN_CLASS = 'hidden';

                testimonialsAmount.textContent = testimonials.length;

                const totalRatings = testimonials.reduce((sum, testimonial) => sum + parseFloat(testimonial.overallRating), 0);
                const averageRating = testimonials.length > 0 ? (totalRatings / testimonials.length).toFixed(1) : "0";

                rateElement.textContent = averageRating;
                rateElement.classList.add(VISIBLE_CLASS);
                rateElement.classList.remove(HIDDEN_CLASS);

                totalElement.textContent = testimonials.length || "0";
                totalElement.classList.add(VISIBLE_CLASS);
                totalElement.classList.remove(HIDDEN_CLASS);

                if (empty1) {
                    empty1.classList.add(HIDDEN_CLASS);
                    empty1.classList.remove(VISIBLE_CLASS);
                }
                if (empty2) {
                    empty2.classList.add(HIDDEN_CLASS);
                    empty2.classList.remove(VISIBLE_CLASS);
                }


                document.getElementById('averageQualityOfEducationSVG').innerHTML = data.averageQualityOfEducationSVG;
                document.getElementById('averageInstructorAttitudeSVG').innerHTML = data.averageInstructorAttitudeSVG;
                document.getElementById('averageCarConditionSVG').innerHTML = data.averageCarConditionSVG;

                const testimonialsContainer = document.querySelector('.testimonials_list-inner');
                testimonialsContainer.innerHTML = '';

                if (testimonials.length <= testimonialsToShow) {
                    document.querySelector('.testimonials_load-more').style.display = 'none';
                } else {
                    document.querySelector('.testimonials_load-more').style.display = 'flex';
                }

                updateTestimonials();

                testimonials.forEach(testimonial => {
                    const likeIcon = document.querySelector(`.testimonial_helpful-item.like[data-testimonial-id="${testimonial.testimonialId}"]`);
                    const dislikeIcon = document.querySelector(`.testimonial_helpful-item.dislike[data-testimonial-id="${testimonial.testimonialId}"]`);

                    if (testimonial.likedBy && testimonial.likedBy.includes(userId)) {
                        if (likeIcon) {
                            likeIcon.closest('.testimonial_helpful-item').classList.add('active');
                        }
                    }
                    if (testimonial.dislikedBy && testimonial.dislikedBy.includes(userId)) {
                        if (dislikeIcon) {
                            dislikeIcon.closest('.testimonial_helpful-item').classList.add('active');
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching testimonials:', error);
            });
    }

    function updateTestimonials() {
        const testimonialsContainer = document.querySelector('.testimonials_list-inner');

        const userId = localStorage.getItem('uid');

        let visibleTestimonials;

        if (window.innerWidth > 991) {
            visibleTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsToShow);
        } else {
            visibleTestimonials = testimonials;
        }

        visibleTestimonials.forEach(testimonial => {
            const testimonialHTML = `
                                <div class="testimonials_slide swiper-slide">
                                    <div class="testimonials_testimonial">
                                        <div class="testimonial_head">
                                         <div class="testimonial__name">${testimonial.firstName && testimonial.lastName ? testimonial.firstName + ' ' + testimonial.lastName : 'Anonymous'}</div>
                                            <div class="testimonial__stars w-embed">
                                                ${testimonial.overallRatingSVG}
                                            </div>
                                        </div>
                                        <p class="testimonial_text">${testimonial.text}</p>
                                        <div class="testimonial_show-more">
                                            <div class="testimonials_show-more-text">Показати детальний рейтинг</div>
                                            <div class="testimonials_show-more-icon w-embed">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 10L12.7071 13.2929C12.3182 13.6818 11.6818 13.6818 11.2929 13.2929L8 10"
                                                        stroke="#EE3556" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="testimonial_rate-list">
                                            <div class="testimonial_rate-item">
                                                <div class="testimonial_rate-title">Якість навчання</div>
                                                <div class="testimonial_rate-stars w-embed">
                                                    ${testimonial.qualityOfEducationSVG}
                                                </div>
                                            </div>
                                            <div class="testimonial_rate-item">
                                                <div class="testimonial_rate-title">Ставлення інструктора</div>
                                                <div class="testimonial_rate-stars w-embed">
                                                    ${testimonial.instructorAttitudeSVG}
                                                </div>
                                            </div>
                                            <div class="testimonial_rate-item">
                                                <div class="testimonial_rate-title">Стан автомобіля</div>
                                                <div class="testimonial_rate-stars w-embed">
                                                    ${testimonial.carConditionSVG}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="testimonial_bottom">
                                            <div class="testimonial_date">${new Date(testimonial.createdAt).toLocaleDateString('uk-UA')}</div>
                                            <div class="testimonial_helpful">
                                                <div class="testimonial_helpful-text">Чи був цей відгук корисним?</div>
                                                <div class="testimonial_helpful-item like" data-testimonial-id="${testimonial.testimonialId}" data-user-id="${testimonial.userId}">
                                                    <div class="testimonial_like-icon w-embed">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11.9303 4.0757L11.9303 4.07571L11.9324 4.07257C12.0559 3.8859 12.297 3.69614 12.6047 3.58739C12.908 3.48018 13.2306 3.46767 13.5098 3.57197L13.5174 3.57483L13.5252 3.57745C14.1796 3.7978 14.607 4.54792 14.4741 5.16818L14.4713 5.18124L14.4692 5.19442L14.0011 8.1379L14.0009 8.13788L13.9993 8.15034C13.9455 8.55333 14.0538 8.93478 14.2953 9.23314L14.3031 9.24274L14.3113 9.25194C14.555 9.52426 14.9135 9.69759 15.305 9.69759H19.0046C19.581 9.69759 20.0285 9.9279 20.28 10.2789C20.5133 10.6115 20.5766 11.0669 20.3963 11.5789L20.3962 11.5789L20.3929 11.589L18.1785 18.3311L18.1729 18.3483L18.1685 18.3658C17.9491 19.2434 16.9468 20.0124 15.9531 20.0124H12.4426C12.1917 20.0124 11.8776 19.9684 11.5865 19.8814C11.2851 19.7914 11.0684 19.6733 10.9598 19.5648L10.9373 19.5423L10.9122 19.5228L9.75997 18.6317L9.75999 18.6317L9.75537 18.6282C9.44175 18.3914 9.25195 18.0092 9.25195 17.605V8.45947C9.25195 8.19961 9.3299 7.94517 9.47351 7.72943C9.47368 7.72917 9.47385 7.72891 9.47403 7.72865L11.9303 4.0757Z" stroke="#555F7E"/>
                                                            <path d="M4.96232 7.20435H5.88947C6.54085 7.20435 6.87168 7.33385 7.04876 7.50274C7.21999 7.66605 7.35179 7.96696 7.35179 8.57665V17.6321C7.35179 18.2418 7.21999 18.5427 7.04876 18.706C6.87168 18.8749 6.54085 19.0044 5.88947 19.0044H4.96232C4.31094 19.0044 3.98012 18.8749 3.80303 18.706C3.63181 18.5427 3.5 18.2418 3.5 17.6321V8.57665C3.5 7.96696 3.63181 7.66605 3.80303 7.50274C3.98012 7.33385 4.31094 7.20435 4.96232 7.20435Z" stroke="#555F7E"/>
                                                        </svg>  
                                                    </div>
                                                    <div class="testimonial_like-count">${testimonial.likes || 0}</div>
                                                </div>
                                                <div class="testimonial_helpful-item dislike"  data-testimonial-id="${testimonial.testimonialId}" data-user-id="${testimonial.userId}">
                                                    <div class="testimonial_dislike-icon w-embed">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12.0698 19.4364L12.0698 19.4364L12.0677 19.4396C11.9443 19.6262 11.7032 19.816 11.3955 19.9247C11.0922 20.0319 10.7696 20.0445 10.4904 19.9402L10.4828 19.9373L10.475 19.9347C9.82063 19.7143 9.39325 18.9642 9.52616 18.344L9.52896 18.3309L9.53105 18.3177L9.99912 15.3743L9.99928 15.3743L10.0009 15.3619C10.0547 14.9589 9.94645 14.5775 9.70492 14.2791L9.69715 14.2695L9.68892 14.2603C9.44526 13.988 9.0867 13.8146 8.69521 13.8146H4.99567C4.41934 13.8146 3.97178 13.5843 3.7203 13.2333C3.48705 12.9008 3.42372 12.4454 3.60401 11.9333L3.60412 11.9334L3.60743 11.9233L5.82175 5.18131L5.8274 5.16412L5.83179 5.14656C6.05118 4.269 7.05343 3.5 8.04711 3.5H11.5576C11.8085 3.5 12.1226 3.54406 12.4137 3.63099C12.7151 3.721 12.9318 3.83908 13.0403 3.94764L13.0628 3.97013L13.088 3.98959L14.2396 4.88033C14.2398 4.88041 14.2399 4.88049 14.24 4.88058C14.5613 5.12991 14.7482 5.50724 14.7482 5.90742V15.0528C14.7482 15.3126 14.6702 15.567 14.5266 15.7828C14.5264 15.783 14.5263 15.7833 14.5261 15.7836L12.0698 19.4364Z" stroke="#555F7E"></path>
                                                            <path d="M19.0379 16.308H18.1107C17.4594 16.308 17.128 16.1785 16.9508 16.01C16.7799 15.8476 16.6484 15.549 16.6484 14.9447V5.88936C16.6484 5.27968 16.7802 4.97878 16.9515 4.81548C17.1285 4.64659 17.4594 4.51709 18.1107 4.51709H19.0379C19.6892 4.51709 20.02 4.64659 20.1971 4.81548C20.3683 4.97878 20.5001 5.27968 20.5001 5.88936V14.9357C20.5001 15.5454 20.3683 15.8463 20.1971 16.0096C20.02 16.1785 19.6892 16.308 19.0379 16.308Z" stroke="#555F7E"></path>
                                                        </svg>
                                                    </div>
                                                    <div class="testimonial_dislike-count">${testimonial.dislikes || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
            testimonialsContainer.insertAdjacentHTML('beforeend', testimonialHTML);

            const likeIcon = document.querySelector(`.testimonial_helpful-item.like[data-testimonial-id="${testimonial.testimonialId}"]`);
            const dislikeIcon = document.querySelector(`.testimonial_helpful-item.dislike[data-testimonial-id="${testimonial.testimonialId}"]`);

            if (testimonial.likedBy && testimonial.likedBy.includes(userId)) {
                if (likeIcon) {
                    likeIcon.closest('.testimonial_helpful-item').classList.add('active');
                }
            }
            if (testimonial.dislikedBy && testimonial.dislikedBy.includes(userId)) {
                if (dislikeIcon) {
                    dislikeIcon.closest('.testimonial_helpful-item').classList.add('active');
                }
            }
        });
    }

    document.querySelector('.testimonials_list-inner').addEventListener('click', function (event) {
        if (event.target.closest('.testimonials_show-more-text')) {
            const testimonial = event.target.closest('.testimonials_testimonial');
            const rateList = testimonial.querySelector('.testimonial_rate-list');
            const text = testimonial.querySelector('.testimonial_text');

            rateList.classList.toggle('visible');
            text.classList.toggle('expanded');

            if (rateList.classList.contains('visible')) {
                event.target.innerHTML = 'Сховати детальний рейтинг';
                testimonial.classList.add('detailed-rating-open');
            } else {
                event.target.innerHTML = 'Показати детальний рейтинг';
                testimonial.classList.remove('detailed-rating-open');
            }
        } else if (event.target.closest('.testimonial_helpful-item.like')) {
            const testimonialId = event.target.closest('.testimonial_helpful-item.like').dataset.testimonialId;
            const reviewerId = event.target.closest('.testimonial_helpful-item.like').dataset.userId;
            likeTestimonial(testimonialId, reviewerId);
        } else if (event.target.closest('.testimonial_helpful-item.dislike')) {
            const testimonialId = event.target.closest('.testimonial_helpful-item.dislike').dataset.testimonialId;
            const reviewerId = event.target.closest('.testimonial_helpful-item.dislike').dataset.userId;
            dislikeTestimonial(testimonialId, reviewerId);
        }
    });

    const loadMoreButton = document.querySelector('.testimonials_load-more');
    loadMoreButton.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex += testimonialsToShow;

        if (currentIndex < testimonials.length) {
            updateTestimonials();
        }

        if (currentIndex + 3 >= testimonials.length) {
            loadMoreButton.style.display = 'none';
        }
    });

    function likeTestimonial(testimonialId, reviewerId) {
        const userId = localStorage.getItem('uid');
        if (!userId) {
            openModal(login_modal);
            return;
        }

        fetch('https://instructor-backend.vercel.app/api/testimonials/like', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmsItemId: cmsItemId, testimonialId, userId, type: 'autoschool', reviewerId })
        })
            .then(response => response.json())
            .then(data => {
                const likeIcon = document.querySelector(`.testimonial_helpful-item.like[data-testimonial-id="${testimonialId}"]`);
                const dislikeIcon = document.querySelector(`.testimonial_helpful-item.dislike[data-testimonial-id="${testimonialId}"]`);
                const likeCountElement = likeIcon.querySelector('.testimonial_like-count');
                const dislikeCountElement = dislikeIcon.querySelector('.testimonial_dislike-count');

                const currentLikeCount = parseInt(likeCountElement.textContent) || 0;
                const currentDislikeCount = parseInt(dislikeCountElement.textContent) || 0;

                if (data.message.includes('liked successfully')) {
                    likeCountElement.textContent = currentLikeCount + 1;
                    likeIcon.closest('.testimonial_helpful-item').classList.add('active');

                    if (dislikeIcon.classList.contains('active')) {
                        dislikeIcon.classList.remove('active');
                        dislikeCountElement.textContent = Math.max(currentDislikeCount - 1, 0);
                    }
                } else if (data.message.includes('like removed successfully')) {
                    likeCountElement.textContent = Math.max(currentLikeCount - 1, 0);
                    likeIcon.closest('.testimonial_helpful-item').classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error liking testimonial:', error);
            });
    }

    function dislikeTestimonial(testimonialId, reviewerId) {
        const userId = localStorage.getItem('uid');
        if (!userId) {
            openModal(login_modal);
            return;
        }

        fetch('https://instructor-backend.vercel.app/api/testimonials/dislike', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmsItemId: cmsItemId, testimonialId, userId, type: 'autoschool', reviewerId })
        })
            .then(response => response.json())
            .then(data => {
                const dislikeIcon = document.querySelector(`.testimonial_helpful-item.dislike[data-testimonial-id="${testimonialId}"]`);
                const likeIcon = document.querySelector(`.testimonial_helpful-item.like[data-testimonial-id="${testimonialId}"]`);
                const dislikeCountElement = dislikeIcon.querySelector('.testimonial_dislike-count');
                const likeCountElement = likeIcon.querySelector('.testimonial_like-count');

                const currentDislikeCount = parseInt(dislikeCountElement.textContent) || 0;
                const currentLikeCount = parseInt(likeCountElement.textContent) || 0;

                if (data.message.includes('disliked successfully')) {
                    dislikeCountElement.textContent = currentDislikeCount + 1;
                    dislikeIcon.closest('.testimonial_helpful-item').classList.add('active');

                    if (likeIcon.classList.contains('active')) {
                        likeIcon.classList.remove('active');
                        likeCountElement.textContent = Math.max(currentLikeCount - 1, 0);
                    }
                } else if (data.message.includes('dislike removed successfully')) {
                    dislikeCountElement.textContent = Math.max(currentDislikeCount - 1, 0);
                    dislikeIcon.closest('.testimonial_helpful-item').classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error disliking testimonial:', error);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    function updateCounter(swiperContainer, counterClass) {
        const counterElement = document.querySelector(counterClass);
        const slides = swiperContainer.querySelectorAll('.swiper-slide');
        if (counterElement) {
            counterElement.textContent = slides.length;
        }
    }

    function hideSectionIfEmpty() {
        const teoryList = document.querySelectorAll('#teory-list .swiper-slide');
        const practicalList = document.querySelectorAll('#practical-list .swiper-slide');

        if (teoryList.length === 0 && practicalList.length === 0) {
            document.querySelector('.instructors-swiper').style.display = 'none';
        } else {
            document.querySelector('.instructors-swiper').style.display = 'block';
        }
    }

    const tabButtons = document.querySelectorAll('.instructor-in-city_head-switch');
    const lists = document.querySelectorAll('.instructor-in-city_list');
    const navControls = document.querySelectorAll('.instructor-in-city_controls');
    const paginations = document.querySelectorAll('.instructor-in-city_pagination');

    function switchTab(tabId, listId, navId, paginationId) {
        tabButtons.forEach(button => button.classList.remove('is-active'));
        lists.forEach(list => list.classList.remove('is-active'));
        navControls.forEach(nav => nav.classList.remove('is-active'));
        paginations.forEach(pagination => pagination.classList.remove('is-active'));

        document.getElementById(tabId).classList.add('is-active');
        document.getElementById(listId).classList.add('is-active');
        document.getElementById(navId).classList.add('is-active');
        document.getElementById(paginationId).classList.add('is-active');
    }

    const teoryList = document.querySelector("#teory-list .swiper-wrapper");

    if (teoryList) {
        const teorySwiper = new Swiper("#teory-list", {
            slidesPerView: "auto",
            spaceBetween: 12,
            breakpoints: {
                991: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                }
            },
            navigation: {
                nextEl: "#navigation-teory #swiper-school-next",
                prevEl: "#navigation-teory #swiper-school-prev",
            },
            pagination: {
                el: "#pagination-teory",
                clickable: true,
            },
        });
        updateCounter(document.querySelector('#teory-list'), '.instructors-swiper_counter');
    }

    const practicalList = document.querySelector("#practical-list .swiper-wrapper");

    if (practicalList) {
        const practicalSwiper = new Swiper("#practical-list", {
            slidesPerView: "auto",
            spaceBetween: 12,
            breakpoints: {
                991: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                }
            },
            navigation: {
                nextEl: "#navigation-practical #swiper-school-next",
                prevEl: "#navigation-practical #swiper-school-prev",
            },
            pagination: {
                el: "#pagination-practical",
                clickable: true,
            },
        });
    }

    document.getElementById('tab-teory').addEventListener('click', () => {
        switchTab('tab-teory', 'teory-list', 'navigation-teory', 'pagination-teory');
        updateCounter(document.querySelector('#teory-list'), '.instructors-swiper_counter');
        hideSectionIfEmpty();
    });

    document.getElementById('tab-practical').addEventListener('click', () => {
        switchTab('tab-practical', 'practical-list', 'navigation-practical', 'pagination-practical');
        updateCounter(document.querySelector('#practical-list'), '.instructors-swiper_counter');
        hideSectionIfEmpty();
    });

    hideSectionIfEmpty();


    const paginationAutos = document.querySelector('#instructors-car-pag');

    const autosList = document.querySelector(".school-cars_list .swiper-wrapper");

    const carsCounter = document.querySelector('.cars-swiper_counter');
    const slides = document.querySelectorAll('.cars-item');

    if (carsCounter) {
        carsCounter.textContent = slides.length;
    }

    if (autosList) {
        const autos = new Swiper(".school-cars_list", {
            slidesPerView: "auto",
            spaceBetween: 12,
            breakpoints: {
                991: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            },
            navigation: {
                nextEl: "#swiper-car-next",
                prevEl: "#swiper-car-prev",
            },
            pagination: {
                el: paginationAutos,
            },
        });
    }

    const breakpoint = window.matchMedia('(max-width: 991px)');

    let testimonialsSwiper;

    const breakpointChecker = function () {
        if (breakpoint.matches === true) {
            enableSwiper();
        } else if (breakpoint.matches === false) {
            if (testimonialsSwiper !== undefined) testimonialsSwiper.destroy(true, true);
        }
    };

    const enableSwiper = function () {
        testimonialsSwiper = new Swiper('.testimonials_swiper', {
            slidesPerView: "auto",
            spaceBetween: 12,
        });
    };

    breakpoint.addListener(breakpointChecker);
    breakpointChecker();
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileInformation = document.querySelector("#mobile-information");
    const mobileInformationOverlay = document.querySelector("#mobile-information-overlay");
    const mobileInformationClose = document.querySelector("#mobile-information-close");
    const informationPopUp = document.querySelector("#mobile-information-modal");

    if (informationPopUp) {
        mobileInformation.addEventListener("click", function (e) {
            informationPopUp.classList.add("visible");
        })
    }

    if (informationPopUp) {
        mobileInformationClose.addEventListener("click", function (e) {
            informationPopUp.classList.remove("visible");
        })
    }

    if (informationPopUp) {
        mobileInformationOverlay.addEventListener("click", function (e) {
            informationPopUp.classList.remove("visible");
        })
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const citySpan = document.querySelector('span[city-name]');
    const cityName = citySpan.getAttribute('city-name');
    citySpan.textContent = cityName;

    const linkElements = document.querySelectorAll('a.instructor-in-city_cta');
    if (linkElements) {
        linkElements.forEach(el => {
            let currentHref = el.getAttribute('href');
            currentHref += '?verified=true';
            el.setAttribute('href', currentHref);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const phoneLinks = document.querySelectorAll('[data-phone]');

    phoneLinks.forEach(phoneLink => {
        const phoneNumber = phoneLink.dataset.phone;

        if (window.innerWidth > 767) {
            const truncatedNumber = phoneNumber.slice(0, 5) + '...(Показати)';

            phoneLink.querySelector('.truncated-number').textContent = truncatedNumber;
            phoneLink.querySelector('.full-number').textContent = phoneNumber;

            phoneLink.addEventListener('click', function (event) {
                const fullNumberElement = this.querySelector('.full-number');
                const truncatedNumberElement = this.querySelector('.truncated-number');

                if (truncatedNumberElement.style.display !== 'none') {
                    event.preventDefault();
                    fullNumberElement.style.display = 'inline';
                    truncatedNumberElement.style.display = 'none';
                    this.href = `tel:${phoneNumber}`;
                }
            });
        } else {
            phoneLink.querySelector('.truncated-number').textContent = 'Подзвонити';
            phoneLink.href = `tel:${phoneNumber}`;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('myTextarea');
    const charCount = document.getElementById('charCount');

    textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        charCount.textContent = `${currentLength}/2048`;
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const serviceItems = document.querySelectorAll('.instructor_services-item');
    const loadMoreBtn = document.querySelector('.services_load-more');
    const servicesCountSpan = document.querySelector('.services_count');
    const initialItemsToShow = 2;

    serviceItems.forEach((item, index) => {
        if (index >= initialItemsToShow) {
            item.style.display = 'none';
        }
    });

    const updateCount = () => {
        const hiddenItemsCount = serviceItems.length - initialItemsToShow;
        console.log(hiddenItemsCount);
        servicesCountSpan.textContent = hiddenItemsCount > 0 ? hiddenItemsCount : 0;
        if (hiddenItemsCount <= 0) {
            loadMoreBtn.style.display = 'none';
        }
    };

    updateCount();

    loadMoreBtn.addEventListener('click', function (event) {
        event.preventDefault();
        serviceItems.forEach(item => {
            item.style.display = 'flex';
        });
        loadMoreBtn.style.display = 'none';
    });

    const addressItems = document.querySelectorAll('.school_adress-item');
    const loadMoreBtn2 = document.querySelector('.adresses_load-more');
    const addressCountSpan = document.querySelector('.adresses_count');
    const initialItemsToShow2 = 2;

    addressItems.forEach((item, index) => {
        if (index >= initialItemsToShow) {
            item.style.display = 'none';
        }
    });

    const updateCount2 = () => {
        const hiddenItemsCount = addressItems.length - initialItemsToShow2;
        addressCountSpan.textContent = hiddenItemsCount > 0 ? hiddenItemsCount : 0;
        if (hiddenItemsCount <= 0) {
            loadMoreBtn2.style.display = 'none';
        }
    };

    updateCount2();

    loadMoreBtn2.addEventListener('click', function (event) {
        event.preventDefault();
        addressItems.forEach(item => {
            item.style.display = 'flex';
        });
        loadMoreBtn2.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const modal_btn = document.querySelector("#add-testimonials");
    const modal_btn_mobile = document.querySelector("#add-testimonials-mobile");
    const modal = document.querySelector("#testimonial-modal");
    const login_modal = document.querySelector("#login-modal");
    const modal_overlay = document.querySelector("#testimonial-modal-overlay");
    const modal_close = document.querySelector("#testimonial-form-close");

    function openModal(modalToOpen) {
        modalToOpen.classList.toggle("visible");
    }

    if (modal_btn) {
        modal_btn.addEventListener("click", function (e) {
            const userData = localStorage.getItem("userData");
            if (userData) {
                openModal(modal);
            } else {
                openModal(login_modal);
            }
        });
    }

    if (modal_btn_mobile) {
        modal_btn_mobile.addEventListener("click", function (e) {
            const userData = localStorage.getItem("userData");
            if (userData) {
                openModal(modal);
            } else {
                openModal(login_modal);
            }
        });
    }

    if (modal_overlay) {
        modal_overlay.addEventListener("click", function (e) {
            modal.classList.remove("visible");
            login_modal.classList.remove("visible");
        });
    }

    if (modal_close) {
        modal_close.addEventListener("click", function (e) {
            modal.classList.remove("visible");
            login_modal.classList.remove("visible");
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const messengersModal = document.getElementById('messangers-modal');
    const instructorMessengers = document.querySelector('.instructor_messangers');
    const footer = document.querySelector('.footer');

    let isInstructorOutOfView = false;
    let isFooterInView = false;

    function updateModalVisibility() {
        if (isInstructorOutOfView && !isFooterInView) {
            messengersModal.classList.add('active');
        } else {
            messengersModal.classList.remove('active');
        }
    }

    const instructorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInstructorOutOfView = !entry.isIntersecting;
            updateModalVisibility();
        });
    });
    instructorObserver.observe(instructorMessengers);

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isFooterInView = entry.isIntersecting;
            updateModalVisibility();
        });
    });
    footerObserver.observe(footer);
});

document.addEventListener('DOMContentLoaded', function () {
    const overlayLogin = document.getElementById('login-modal-overlay');
    const modalLogin = document.getElementById('login-modal');

    overlayLogin.addEventListener('click', function () {
        modalLogin.classList.remove('visible');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const origin = window.location.origin;

    const schools = document.querySelectorAll('.content_item-link[data-slug]');

    schools.forEach(function (element) {
        const slug = element.getAttribute('data-slug');
        const link = document.createElement('a');

        link.setAttribute('href', origin + '/schools-list/' + slug);
        link.className = element.className;
        link.innerHTML = element.innerHTML;

        element.parentNode.replaceChild(link, element);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.instructor_images-list .instructor_images');

    if (items.length > 4) {
        const remainingItemsCount = items.length - 4;
        const fourthItem = items[3];

        const span = document.createElement('span');
        span.textContent = `+${remainingItemsCount}`;
        span.classList.add('lightbox-count');

        fourthItem.style.position = 'relative';
        fourthItem.appendChild(span);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("testimonial-form");
    const submitButton = form.querySelector('input[type="submit"]');
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');

    function checkFormValidity() {
        let allValid = true;
        requiredInputs.forEach(function (input) {
            if (input.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
                let groupChecked = false;
                radioGroup.forEach(function (radio) {
                    if (radio.checked) {
                        groupChecked = true;
                    }
                });
                if (!groupChecked) {
                    allValid = false;
                }
            } else if (input.type === 'checkbox') {
                if (!input.checked) {
                    allValid = false;
                }
            } else if (input.value.trim() === '') {
                allValid = false;
            }
        });

        submitButton.disabled = !allValid;
        if (!allValid) {
            submitButton.classList.add('is-disabled');
        } else {
            submitButton.classList.remove('is-disabled');
        }
    }

    requiredInputs.forEach(function (input) {
        input.addEventListener("input", checkFormValidity);
        input.addEventListener("change", checkFormValidity);
    });

    checkFormValidity();
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[data-href]').forEach(function (element) {
        const dataHref = element.getAttribute('data-href');
        if (dataHref) {
            element.setAttribute('href', dataHref);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const truncatedElement = document.querySelectorAll('.mobile-website');

    truncatedElement.forEach(el => {
        let originalTextContent = el.textContent;

        if (originalTextContent.includes('http://') || originalTextContent.includes('https://')) {
            let cleanedUrl = originalTextContent.replace(/^https?:\/\//, '');
            if (cleanedUrl.includes('/')) {
                cleanedUrl = cleanedUrl.split('/')[0];
            }
            el.textContent = cleanedUrl;
        }
    })

    const textarea = document.getElementById('myTextarea');

    textarea.addEventListener('input', () => {
        textarea.scrollTop = textarea.scrollHeight;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const login_modal = document.querySelector("#login-modal-2");

    const login_modal_overlay = login_modal.querySelector("#login-modal-overlay");

    login_modal_overlay.addEventListener('click', () => {
        login_modal.classList.remove('visible');
    });

    function openModal(modalToOpen) {
        modalToOpen.classList.toggle("visible");
    }

    const nameField = document.getElementById("Name-Register");
    const emailField = document.getElementById("Email-Register");
    const phoneField = document.getElementById("Tel-Register");
    const commentField = document.getElementById("Comment-Register");
    const checkboxField = document.getElementById("Checkbox-Register");
    const submitBtn = document.getElementById("Submit-Register");

    const toggleSubmitButton = () => {
        const isCommentValid = commentField.value.trim().length >= 10;
        const isCheckboxChecked = checkboxField.checked;

        if (isCommentValid && isCheckboxChecked) {
            submitBtn.classList.remove("is-disabled");
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.add("is-disabled");
            submitBtn.disabled = true;
        }
    };

    commentField.addEventListener("input", toggleSubmitButton);
    checkboxField.addEventListener("change", toggleSubmitButton);

    toggleSubmitButton();

    const charCount = document.getElementById('charCount2');

    commentField.addEventListener('input', () => {
        const currentLength = commentField.value.length;
        charCount.textContent = `${currentLength}/520`;
    });

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (userData) {
        if (userData.firstName) nameField.value = userData.firstName + ' ' + userData.lastName;
        if (userData.email) emailField.value = userData.email;
        phoneField.value = localStorage.getItem("uid") || "";
    }

    const serviceItems = document.querySelectorAll('.instructor_services-item');
    const registerModal = document.getElementById('registration-modal');
    const registerForm = document.getElementById('registration-form');
    const registerTitle = document.querySelector('.registration-modal_title');
    const registerClose = document.querySelector('.registration-modal_close');
    const registerOverlay = document.querySelector('.registration-modal_overlay');
    const registerSuccess = document.querySelector('.modal-request_success');

    registerClose.addEventListener('click', () => {
        registerModal.classList.remove('visible');
        registerSuccess.style.display = "none";
        registerForm.style.display = "block";
        commentField.value = '';
    });

    registerOverlay.addEventListener('click', () => {
        registerModal.classList.remove('visible');
        registerSuccess.style.display = "none";
        registerForm.style.display = "block";
        commentField.value = '';
    });

    const updateSubscriptionCounts = () => {
        serviceItems.forEach(async (item) => {
            const slug = item.getAttribute("data-slug");
            try {
                const response = await fetch(
                    `https://instructor-backend.vercel.app/services/${slug}/subscribers`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch subscriptions for ${slug}`);
                }
                const data = await response.json();
                const countElement = item.querySelector(".services-item_count");
                const subscriptions = data.subscribers || 0;

                function getDeclension(number) {
                    const lastDigit = number % 10;
                    const lastTwoDigits = number % 100;

                    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                        return "разів";
                    }

                    if (lastDigit === 1) {
                        return "раз";
                    } else if (lastDigit >= 2 && lastDigit <= 4) {
                        return "рази";
                    } else {
                        return "разів";
                    }
                }

                countElement.textContent = `Записались ${subscriptions} ${getDeclension(subscriptions)}`;
            } catch (error) {
                console.error("Error updating subscription counts:", error);
            }
        });
    };

    // Define handleSubscription function outside the loop
    const handleSubscription = async (slug) => {
        const subscribedServices = JSON.parse(sessionStorage.getItem("subscribedServices") || "[]");

        if (subscribedServices.includes(slug)) {
            console.log(`User already subscribed to ${slug} during this session.`);
            return;
        }

        try {
            const response = await fetch(
                `https://instructor-backend.vercel.app/services/${slug}/subscribers`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to increment subscribers for ${slug}`);
            }

            // Update subscription counts
            updateSubscriptionCounts();

            // Store the slug in sessionStorage to mark as subscribed
            subscribedServices.push(slug);
            sessionStorage.setItem("subscribedServices", JSON.stringify(subscribedServices));
        } catch (error) {
            console.error("Error incrementing subscribers:", error);
        }
    };

    serviceItems.forEach((item) => {
        const cta = item.querySelector(".services-item_cta");
        const phone = item.querySelector(".services-item_phone");
        const website = item.querySelector(".services-item_website");
        const name = item.querySelector('.services-item_title').textContent;

        phone.addEventListener("click", () => {
            const slug = item.getAttribute("data-slug");
            handleSubscription(slug);
        });

        website.addEventListener("click", () => {
            const slug = item.getAttribute("data-slug");
            handleSubscription(slug);
        });

        cta.addEventListener("click", (event) => {
            event.preventDefault();

            const userId = localStorage.getItem("uid");
            if (!userId) {
                openModal(login_modal);
                return;
            }
            registerTitle.textContent = `Запис на "${name}"`;
            registerModal.classList.add("visible");

            // Store the slug in the form's data attribute
            const slug = item.getAttribute("data-slug");
            registerForm.setAttribute("data-slug", slug);
        });
    });

    // Event listener for form submission
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const slug = registerForm.getAttribute("data-slug");
        handleSubscription(slug);
    });

    // Initial fetch to update subscription counts on page load
    updateSubscriptionCounts();

});
