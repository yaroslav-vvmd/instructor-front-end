<script>
    (function () {
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    })();

    if (!localStorage.getItem('userData')) {
        window.location.href = '/';
    }
</script>

<script>

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

</script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const deleteAccCta = document.querySelector(".profile_delete");
        const deleteModal = document.querySelector("#delete-ac-modal");
        const deleteModalOverlay = document.querySelector("#delete-ac-modal-overlay");
        const deleteModalConfirm = document.querySelector("#delete-ac-modal-confirm");
        const deleteModalCancel = document.querySelector("#delete-ac-modal-cancel");

        if (deleteAccCta) {
            deleteAccCta.addEventListener("click", function () {
                deleteModal.classList.add("visible");
            });

            deleteModalOverlay.addEventListener("click", function () {
                deleteModal.classList.remove("visible");
            });

            deleteModalConfirm.addEventListener("click", function () {
                deleteModal.classList.remove("visible");
            });

            deleteModalCancel.addEventListener("click", function () {
                deleteModal.classList.remove("visible");
            });
        }



        const deleteCommentsCta = document.querySelectorAll(".profile_testimonial-delete-cta");
        const deleteCommentsModal = document.querySelector("#delete-comments-modal");
        const deleteCommentsModalOverlay = document.querySelector("#delete-comments-modal-overlay");
        const deleteCommentsModalConfirm = document.querySelector("#delete-comments-modal-confirm");
        const deleteCommentsModalCancel = document.querySelector("#delete-comments-modal-cancel");

        if (deleteCommentsCta.length) {
            deleteCommentsCta.forEach(el => {
                el.addEventListener("click", function () {
                    deleteCommentsModal.classList.add("visible");
                });
            })

            deleteCommentsModalOverlay.addEventListener("click", function () {
                deleteCommentsModal.classList.remove("visible");
            });
            

            deleteCommentsModalConfirm.addEventListener("click", function () {
                deleteCommentsModal.classList.remove("visible");
            });

            deleteCommentsModalCancel.addEventListener("click", function () {
                deleteCommentsModal.classList.remove("visible");
            });
        }

        const profileTabs = document.querySelectorAll(".profile_tab");
        const profileTabsMobile = document.querySelectorAll(".profile_mobile-tab");
        const profilePanes = document.querySelectorAll(".profile_tab-pane");
        const dropdownTabs = document.querySelectorAll(".user-controls_item");

        if (profileTabs.length) {
            profileTabs.forEach((el, index) => {
                el.addEventListener("click", function (e) {

                    dropdownTabs.forEach(el => {
                        el.classList.remove("w--current");
                    })

                    profileTabs.forEach(el => {
                        el.classList.remove("is-active");
                    })

                    profilePanes.forEach(el => {
                        el.classList.remove("is-active");
                    })

                    profileTabsMobile.forEach(el => {
                        el.classList.remove("is-active");
                    })

                    dropdownTabs[index].classList.add("w--current");
                    profileTabs[index].classList.add("is-active");
                    profilePanes[index].classList.add("is-active");
                    profileTabsMobile[index].classList.add("is-active");
                })
            })
        }

        const mobileTabsOpen = document.querySelector(".profile_mobile-tabs");
        const mobileTabs = document.querySelector(".profile_tab-menu-inner");
        const mobileTabsClose = document.querySelector(".profile_tab-mobile-head_close");

        mobileTabsOpen.addEventListener("click", function (e) {
            mobileTabs.classList.add("is-visible");
        })

        mobileTabsClose.addEventListener("click", function (e) {
            mobileTabs.classList.remove("is-visible");
        })

        mobileTabs.addEventListener('click', function (event) {
            if (event.target === this) {
                this.classList.remove('is-visible');
            }
        });

        profileTabs.forEach(el => {
            el.addEventListener("click", function (e) {
                mobileTabs.classList.remove("is-visible");
            })
        })
    });

    document.addEventListener("DOMContentLoaded", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        const tabs = document.querySelectorAll('.profile_tab');
        const panes = document.querySelectorAll('.profile_tab-pane');

        if (tab === '2') {
            tabs.forEach(tab => tab.classList.remove('is-active'));
            panes.forEach(pane => pane.classList.remove('is-active'));
            tabs[1].classList.add('is-active');
            panes[1].classList.add('is-active');
        }
    });
</script>

<script>
    const userId = localStorage.getItem('uid');
    if (!userId) {
        console.error('User is not logged in');
    }
    let testimonials = [];
    let loadmoreStatus = false;
    const testimonialsContainer = document.querySelector('.profile_testimonials');

    fetchUserTestimonials(userId, 4);

    function fetchUserTestimonials(userId, number) {
        fetch(`https://instructor-backend.vercel.app/api/user/testimonials/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    throw new Error('No testimonials found for this user');
                }
                return response.json();
            })
            .then((data) => {
                testimonials = data.reverse(); // Reverse to show the newest testimonials first
                currentIndex = 0;
                updateTestimonials(number);
            })
            .catch((error) => {
                console.error('Error fetching user testimonials:', error);
            });
    }

    function updateTestimonials(number) {
        testimonialsContainer.innerHTML = '';
        const totalTestimonialsCountElement = document.querySelector('.profile_tab-text_count');
        const totalTestimonialsCountElement2 = document.querySelector('.profile_mobile-tab-icon-count');
        const loadMoreButton = document.querySelector('.testimonials_load-more');
        const emptyStateElement = document.querySelector('.profile_testimonials-empty');

        let visibleTestimonials = testimonials.slice(
            0, number
        );
        visibleTestimonials.forEach((testimonial) => {
            const testimonialHTML = `
        <div class="profile_testimonial">
          <div class="testimonials_testimonial">
            <div class="testimonial_head">
              <div class="testimonial__name">
                ${testimonial.testimonialName
                    ? testimonial.testimonialName
                    : 'Anonymous'
                }
              </div>
              <div class="testimonial__stars w-embed">
                ${testimonial.overallRatingSVG}
              </div>
            </div>
            <p class="testimonial_text">${testimonial.text}</p>
            <div class="testimonial_show-more">
              <div class="testimonials_show-more-text">Показати детальний рейтинг</div>
              <div class="testimonials_show-more-icon w-embed">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3332 8.33203L10.5891 11.0761C10.265 11.4002 9.73469 11.4002 9.41061 11.0761L6.6665 8.33203" stroke="#EE3556" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
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
              <div class="testimonial_date">
                ${new Date(testimonial.createdAt).toLocaleDateString('uk-UA')}
              </div>
              <div class="testimonial_helpful">
                <div class="testimonial_helpful-text">Чи був цей відгук корисним?</div>
                <div class="testimonial_helpful-item like" ${testimonial.instructorId ? `data-instructor-id="${testimonial.instructorId}"` : `data-autoschool-id="${testimonial.autoschoolId}"`}
  data-testimonial-id="${testimonial.testimonialId}" data-user-id="${testimonial.userId}">
  <div class="testimonial_like-icon w-embed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.9303 4.0757L11.9303 4.07571L11.9324 4.07257C12.0559 3.8859 12.297 3.69614 12.6047 3.58739C12.908 3.48018 13.2306 3.46767 13.5098 3.57197L13.5174 3.57483L13.5252 3.57745C14.1796 3.7978 14.607 4.54792 14.4741 5.16818L14.4713 5.18124L14.4692 5.19442L14.0011 8.1379L14.0009 8.13788L13.9993 8.15034C13.9455 8.55333 14.0538 8.93478 14.2953 9.23314L14.3031 9.24274L14.3113 9.25194C14.555 9.52426 14.9135 9.69759 15.305 9.69759H19.0046C19.581 9.69759 20.0285 9.9279 20.28 10.2789C20.5133 10.6115 20.5766 11.0669 20.3963 11.5789L20.3962 11.5789L20.3929 11.589L18.1785 18.3311L18.1729 18.3483L18.1685 18.3658C17.9491 19.2434 16.9468 20.0124 15.9531 20.0124H12.4426C12.1917 20.0124 11.8776 19.9684 11.5865 19.8814C11.2851 19.7914 11.0684 19.6733 10.9598 19.5648L10.9373 19.5423L10.9122 19.5228L9.75997 18.6317L9.75999 18.6317L9.75537 18.6282C9.44175 18.3914 9.25195 18.0092 9.25195 17.605V8.45947C9.25195 8.19961 9.3299 7.94517 9.47351 7.72943C9.47368 7.72917 9.47385 7.72891 9.47403 7.72865L11.9303 4.0757Z" stroke="#555F7E"></path>
                                                        <path d="M4.96232 7.20435H5.88947C6.54085 7.20435 6.87168 7.33385 7.04876 7.50274C7.21999 7.66605 7.35179 7.96696 7.35179 8.57665V17.6321C7.35179 18.2418 7.21999 18.5427 7.04876 18.706C6.87168 18.8749 6.54085 19.0044 5.88947 19.0044H4.96232C4.31094 19.0044 3.98012 18.8749 3.80303 18.706C3.63181 18.5427 3.5 18.2418 3.5 17.6321V8.57665C3.5 7.96696 3.63181 7.66605 3.80303 7.50274C3.98012 7.33385 4.31094 7.20435 4.96232 7.20435Z" stroke="#555F7E"></path>
                                                    </svg></div>
                  <div class="testimonial_like-count">${testimonial.likes || 0}</div>
                </div>
                <div class="testimonial_helpful-item dislike" ${testimonial.instructorId ? `data-instructor-id="${testimonial.instructorId}"` : `data-autoschool-id="${testimonial.autoschoolId}"`}
  data-testimonial-id="${testimonial.testimonialId}" data-user-id="${testimonial.userId}">
  <div class="testimonial_like-icon w-embed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.0698 19.4364L12.0698 19.4364L12.0677 19.4396C11.9443 19.6262 11.7032 19.816 11.3955 19.9247C11.0922 20.0319 10.7696 20.0445 10.4904 19.9402L10.4828 19.9373L10.475 19.9347C9.82063 19.7143 9.39325 18.9642 9.52616 18.344L9.52896 18.3309L9.53105 18.3177L9.99912 15.3743L9.99928 15.3743L10.0009 15.3619C10.0547 14.9589 9.94645 14.5775 9.70492 14.2791L9.69715 14.2695L9.68892 14.2603C9.44526 13.988 9.0867 13.8146 8.69521 13.8146H4.99567C4.41934 13.8146 3.97178 13.5843 3.7203 13.2333C3.48705 12.9008 3.42372 12.4454 3.60401 11.9333L3.60412 11.9334L3.60743 11.9233L5.82175 5.18131L5.8274 5.16412L5.83179 5.14656C6.05118 4.269 7.05343 3.5 8.04711 3.5H11.5576C11.8085 3.5 12.1226 3.54406 12.4137 3.63099C12.7151 3.721 12.9318 3.83908 13.0403 3.94764L13.0628 3.97013L13.088 3.98959L14.2396 4.88033C14.2398 4.88041 14.2399 4.88049 14.24 4.88058C14.5613 5.12991 14.7482 5.50724 14.7482 5.90742V15.0528C14.7482 15.3126 14.6702 15.567 14.5266 15.7828C14.5264 15.783 14.5263 15.7833 14.5261 15.7836L12.0698 19.4364Z" stroke="#555F7E"></path>
                                                        <path d="M19.0379 16.308H18.1107C17.4594 16.308 17.128 16.1785 16.9508 16.01C16.7799 15.8476 16.6484 15.549 16.6484 14.9447V5.88936C16.6484 5.27968 16.7802 4.97878 16.9515 4.81548C17.1285 4.64659 17.4594 4.51709 18.1107 4.51709H19.0379C19.6892 4.51709 20.02 4.64659 20.1971 4.81548C20.3683 4.97878 20.5001 5.27968 20.5001 5.88936V14.9357C20.5001 15.5454 20.3683 15.8463 20.1971 16.0096C20.02 16.1785 19.6892 16.308 19.0379 16.308Z" stroke="#555F7E"></path>
                                                    </svg></div>
                  <div class="testimonial_dislike-count">${testimonial.dislikes || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="profile_testimonial-delete-cta w-inline-block" ${testimonial.instructorId ? `data-instructor-id="${testimonial.instructorId}"` : `data-autoschool-id="${testimonial.autoschoolId}"`} data-testimonial-id="${testimonial.testimonialId}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.85194 3.36655L9.96766 4.05038V4.32211C8.71035 4.26347 7.45327 4.25181 6.19784 4.30408L6.23582 4.07258L6.35291 3.35892C6.40085 3.06825 6.44178 2.88396 6.54975 2.75094C6.62998 2.65208 6.81885 2.5 7.37143 2.5H8.83307C9.38189 2.5 9.57307 2.65637 9.656 2.76053C9.76672 2.89959 9.80653 3.08809 9.85144 3.36358L9.85144 3.36358L9.85194 3.36655Z" fill="#FEFEFF" stroke="#555F7E"/>
  <path d="M12.1415 5.84257C12.0076 5.7031 11.8235 5.625 11.6339 5.625H4.58226C4.39258 5.625 4.2029 5.7031 4.07459 5.84257C3.94628 5.98204 3.87376 6.17172 3.88491 6.36698L4.2308 12.0908C4.29217 12.9388 4.37027 13.9988 6.31727 13.9988H9.89886C11.8459 13.9988 11.924 12.9444 11.9853 12.0908L12.3312 6.37256C12.3424 6.17172 12.2698 5.98204 12.1415 5.84257ZM9.03415 11.2038H7.17641C6.94767 11.2038 6.758 11.0141 6.758 10.7854C6.758 10.5567 6.94767 10.367 7.17641 10.367H9.03415C9.26288 10.367 9.45256 10.5567 9.45256 10.7854C9.45256 11.0141 9.26288 11.2038 9.03415 11.2038ZM9.50277 8.97228H6.71337C6.48463 8.97228 6.29496 8.7826 6.29496 8.55387C6.29496 8.32514 6.48463 8.13546 6.71337 8.13546H9.50277C9.7315 8.13546 9.92118 8.32514 9.92118 8.55387C9.92118 8.7826 9.7315 8.97228 9.50277 8.97228Z" fill="#555F7E"/>
  </svg> Видалити відгук
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

        // Update the total testimonial count
        totalTestimonialsCountElement.textContent = `(${testimonials.length})`;
        totalTestimonialsCountElement2.textContent = `(${testimonials.length})`;

        // Toggle the "Load More" button visibility
        if (testimonials.length > 4) {
            loadMoreButton.style.display = 'flex';
        } else {
            loadMoreButton.style.display = 'none';
        }

        // Show or hide the empty state
        if (testimonials.length === 0) {
            emptyStateElement.style.display = 'flex';
        } else {
            emptyStateElement.style.display = 'none';
        }

    }

    document.querySelector('.profile_testimonials').addEventListener('click', function (event) {
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
        }
    });

    const loadMoreButton = document.querySelector('.testimonials_load-more');

    loadMoreButton.addEventListener('click', loadMore);

    function loadMore() {
        updateTestimonials(testimonials.length);
        this.classList.add('hidden');
        loadmoreStatus = true;
    }

    // Handle Like and Dislike Actions
    document.querySelector('.profile_testimonials').addEventListener('click', (event) => {
        if (event.target.closest('.testimonial_helpful-item.like')) {
            const testimonialId = event.target.closest('.testimonial_helpful-item.like').dataset.testimonialId;
            likeTestimonial(testimonialId);
        } else if (event.target.closest('.testimonial_helpful-item.dislike')) {
            const testimonialId = event.target.closest('.testimonial_helpful-item.dislike').dataset.testimonialId;
            dislikeTestimonial(testimonialId);
        }
    });

    /// Open the delete modal when the delete button is clicked
    document.querySelector('.profile_testimonials').addEventListener('click', function (event) {
        if (event.target.closest('.profile_testimonial-delete-cta')) {
            const userId = localStorage.getItem('uid');
            const testimonialId = event.target.closest('.profile_testimonial-delete-cta').dataset.testimonialId;
            const cmsItemId = event.target.closest('.profile_testimonial-delete-cta').dataset.instructorId || event.target.closest('.profile_testimonial-delete-cta').dataset.autoschoolId;
            const type = event.target.closest('.profile_testimonial-delete-cta').dataset.instructorId ? 'instructors' : 'autoschool';

            // Open the delete modal
            const deleteModal = document.getElementById('delete-comments-modal');
            deleteModal.classList.add('visible');

            // Add event listener for confirming the delete action
            document.getElementById('delete-comments-modal-confirm').onclick = function () {
                deleteTestimonial(testimonialId, userId, type, cmsItemId);
                deleteModal.classList.remove('visible');  // Close the modal
            };

            // Add event listener for canceling the delete action
            document.getElementById('delete-comments-modal-cancel').onclick = function () {
                deleteModal.classList.remove('visible');  // Close the modal
            };
            document.getElementById('delete-comments-modal-overlay').onclick = function () {
                deleteModal.classList.remove('visible');  // Close the modal
            };
        }
    });

    // Function to delete the testimonial by making an API call
    function deleteTestimonial(testimonialId, userId, type, cmsItemId) {
        fetch('https://instructor-backend.vercel.app/api/testimonials/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testimonialId, userId, type, cmsItemId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Testimonial deleted successfully') {
                    const deleteButton = document.querySelector(`.profile_testimonial-delete-cta[data-testimonial-id="${testimonialId}"]`);
                    const testimonialElement = deleteButton ? deleteButton.parentElement : null;

                    if (testimonialElement) {
                        const successElement = document.querySelector('#review-deleted-popup');
                        successElement.classList.add('is-visible');
                        if (loadmoreStatus) {
                            testimonialElement.remove();
                            fetchUserTestimonials(userId, testimonials.length);

                        } else {
                            fetchUserTestimonials(userId, 4);
                        }
                        setTimeout(() => {
                            successElement.classList.remove('is-visible');
                        }, 10000);
                    }
                }
            })
            .catch(error => {
                console.error('Error deleting testimonial:', error);
            });
    }


    function likeTestimonial(testimonialId) {
        const userId = localStorage.getItem('uid');
        if (!userId) {
            openModal(login_modal);
            return;
        }

        const likeButton = document.querySelector(`.testimonial_helpful-item.like[data-testimonial-id="${testimonialId}"]`);
        const cmsItemId = likeButton.getAttribute('data-instructor-id') || likeButton.getAttribute('data-autoschool-id');
        const type = likeButton.hasAttribute('data-instructor-id') ? 'instructor' : 'autoschool';
        const reviewerId = likeButton.getAttribute('data-user-id');

        fetch('https://instructor-backend.vercel.app/api/testimonials/like', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmsItemId, testimonialId, userId, type, reviewerId })
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


    function dislikeTestimonial(testimonialId) {
        const userId = localStorage.getItem('uid');
        if (!userId) {
            openModal(login_modal);
            return;
        }

        const dislikeButton = document.querySelector(`.testimonial_helpful-item.dislike[data-testimonial-id="${testimonialId}"]`);
        const cmsItemId = dislikeButton.getAttribute('data-instructor-id') || dislikeButton.getAttribute('data-autoschool-id');
        const type = dislikeButton.hasAttribute('data-instructor-id') ? 'instructor' : 'autoschool';
        const reviewerId = dislikeButton.getAttribute('data-user-id');

        fetch('https://instructor-backend.vercel.app/api/testimonials/dislike', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmsItemId, testimonialId, userId, type, reviewerId })
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
</script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");

        // Prefill the form fields with the user data
        if (userData) {
            const firstNameField = document.getElementById("firstName");
            const lastNameField = document.getElementById("lastName");
            const emailField = document.getElementById("email");
            const roleAutoschoolField = document.getElementById("role_autoschool");
            const roleInstructorField = document.getElementById("role_instructor");
            const newsletterField = document.getElementById("newsletter");

            // Fill the fields only if data exists
            if (userData.firstName) firstNameField.value = userData.firstName;
            if (userData.lastName) lastNameField.value = userData.lastName;
            if (userData.email) emailField.value = userData.email;
            if (userData.role_autoschool) roleAutoschoolField.checked = userData.role_autoschool;
            if (userData.role_instructor) roleInstructorField.checked = userData.role_instructor;
            if (userData.newsletter) newsletterField.checked = userData.newsletter;
        }

        const uidInput = document.getElementById('uid');
        uidInput.value = localStorage.getItem("uid") || "";

        const form = document.getElementById("profile-form");
        const changeButton = document.querySelector('.profile_change');

        // Get the form fields
        const firstName = form.querySelector("#firstName");
        const lastName = form.querySelector("#lastName");
        const email = form.querySelector("#email");

        // Validation Functions
        function validateField(input) {
            const errorElement = input.closest('.login_form-field').querySelector('.login_form-error');
            if (input.value.trim() === "") {
                errorElement.style.display = 'block';
                return false;
            } else {
                errorElement.style.display = 'none';
                return true;
            }
        }

        function validateEmail(email) {
            const errorElement = email.closest('.login_form-field').querySelector('.login_form-error');
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (regex.test(email.value.trim())) {
                errorElement.style.display = 'none';
                return true;
            } else {
                errorElement.style.display = 'block';
                return false;
            }
        }

        // Check if all fields are valid for enabling/disabling the submit button
        function checkInputs() {
            const isEmailValid = validateEmail(email);
            const isFirstNameValid = validateField(firstName);
            const isLastNameValid = validateField(lastName);

            // If all fields are valid, enable the submit button, otherwise disable it
            if (isFirstNameValid && isLastNameValid && isEmailValid) {
                changeButton.style.pointerEvents = 'auto';
                changeButton.style.opacity = '1';
            } else {
                changeButton.style.pointerEvents = 'none';
                changeButton.style.opacity = '0.6';
            }
        }

        // Add event listeners to fields for real-time validation
        firstName.addEventListener('input', function () {
            validateField(firstName); // Validate first name
            checkInputs(); // Check if the form is ready to submit
        });

        lastName.addEventListener('input', function () {
            validateField(lastName); // Validate last name
            checkInputs(); // Check if the form is ready to submit
        });

        email.addEventListener('input', function () {
            validateEmail(email); // Validate email
            checkInputs(); // Check if the form is ready to submit
        });


        checkInputs();

        const handlerSubmitForm = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let isValid = true;

            // Validate all fields
            if (!validateField(firstName)) isValid = false;
            if (!validateField(lastName)) isValid = false;
            if (!validateEmail(email)) isValid = false;

            // If all fields are valid, allow the form to be submitted


            const values = {};

            $(form).find('input, select, textarea').each(function () {
                // Skip submit and button elements
                if ($(this).attr('type') === 'submit' || $(this).attr('type') === 'button') {
                    return; // Skip this iteration
                }

                const name = $(this).attr('name');
                const value = $(this).val();

                // If it's a checkbox, manually check if it's checked or unchecked
                if ($(this).attr('type') === 'checkbox') {
                    // If checked, set to true; if not checked, set to false
                    values[name] = $(this).prop('checked') ? true : false;
                } else {
                    // Otherwise, take the value as usual
                    values[name] = value;
                }
            });

            if (isValid) {
                try {
                    const response = await fetch("https://instructor-back-end.vercel.app/update-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    });

                    const data = await response.json();

                    if (data.success) {

                        fetch("https://events.sendpulse.com/events/name/instructor_registration", {
                            method: "POST",
                            headers: {
                                "Authorization": token, // Corrected header name
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: values.email,
                                phone: values.uid,
                                user_f_name: values.firstName,
                                user_l_name: values.lastName,
                                user_school: values.role_autoschool,
                                user_instructor: values.role_instructor,
                                user_subscriber: values.newsletter,
                            }),
                        })
                            .then(response => response.json())
                            .then(responseData => {
                                console.log(responseData);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });

                        localStorage.setItem("userData", JSON.stringify(values));

                        // Show the success message
                        const successElement = document.querySelector('.successfully-saved');
                        successElement.classList.add('is-visible');
                        setTimeout(() => {
                            successElement.classList.remove('is-visible');
                        }, 10000);

                    } else {
                        alert("Something went wrong! Please try again.");
                    }

                } catch (e) {
                    console.log(e);
                    alert("An error occurred while updating your profile");
                }

            }
        }
        form.addEventListener("submit", handlerSubmitForm);

    });
</script>

<script>
    document.getElementById("delete-ac-modal-confirm").addEventListener("click", async function () {
        const uid = localStorage.getItem("uid"); // Get the user UID from localStorage

        try {
            const response = await fetch("https://instructor-back-end.vercel.app/delete-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.clear();
                window.location.pathname = "/"; // Redirect to homepage or login page
            }

        } catch (error) {
            console.error("Error deleting account:", error);
        }
    });
</script>