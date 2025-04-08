<script>
    import { onMount, onDestroy } from 'svelte';
    import InputField from '$lib/components/InputField.svelte';
    import GoogleMatrialIcon from '$lib/components/GoogleMatrialIcon.svelte';
    import LineLoader from '$lib/components/LineLoader.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    export let endPoint;
    let errorMessage = '';
    let isSubmitting = false;
    let formObject = { oldPassword: '', newPassword: '' };
    let confirmPassword = '';
    let showOldPassword = false;
    let showPassword = false;
    let showConfirmPassword = false;
    let showToast = false;
    let dispatch = createEventDispatcher();
    function handleCancel() {
        errorMessage = '';
        formObject = { oldPassword: '', newPassword: '' };
        confirmPassword = '';
        dispatch('closePopup', true);
    }
    async function handleSubmit() {
        try {
            errorMessage = '';
            isSubmitting = true;
            showToast=false;
            if (!formObject.oldPassword) {
                errorMessage = 'Please enter your current password.';
                return;
            }
            if (!formObject.newPassword || !confirmPassword) {
                errorMessage = 'Please enter and confirm your password.';
                return;
            }
            if (formObject.newPassword.length < 8) {
                errorMessage = 'Password must be at least 8 characters long.';
                return;
            }
            if (formObject.newPassword !== confirmPassword) {
                errorMessage = 'Passwords do not match.';
                return;
            }
            const response = await fetch(endPoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formObject)
            });
            let responseData
            try {
                responseData = await response?.json(); 
                } catch (jsonError) {
                 responseData = { error: 'Failed to reset password. Please try again.' }; 
            } 
     
         
            if (response?.status == 400 || response?.status == 500) {
                errorMessage = responseData?.error || 'Failed to reset password.';
                return;
            }
            if (response?.status === 401) {
                const fromUrl = $page.url.pathname + $page.url.search;
                goto(`/login?redirectTo=${fromUrl}`);
                return;
            }
            if (!response?.ok) {
                errorMessage = responseData?.error ||'Failed to reset password. Please try again.';
                return;
            }
            // Success
            errorMessage = '';
            showToast = true;
            dispatch('handleToast', showToast)
            handleCancel();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            isSubmitting = false;
        }
    }
    onMount(() => {
        document.body.style.overflow = 'hidden';
    });
    onDestroy(() => {
        document.body.style.overflow = '';
    });
</script>
<div class="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <form class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 m-4" on:submit|preventDefault={handleSubmit}>
        
        {#if isSubmitting}
        <div class="mb-4">
            <LineLoader />
        </div>
        {/if}
        {#if errorMessage}
        <div class="rounded-md bg-red-50 p-2 mb-2">
           <span class="text-sm font-medium text-red-800"> {errorMessage}</span>
        </div>
        {/if}
        <h2 class="text-base font-semibold text-primary mb-2">Reset Password</h2>
        <!-- Old Password Field -->
        <div class="relative mb-2">
            <InputField
                label="Current Password"
                placeholder="Enter current password"
                name="oldPassword"
                bind:value={formObject.oldPassword}
                required
                type={showOldPassword ? 'text' : 'password'}
            />
            <span class="absolute top-4 inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                on:click={() => (showOldPassword = !showOldPassword)}>
                <GoogleMatrialIcon iconName={showOldPassword ? "visibility" : "visibility_off"} addClass="text-base" />
            </span>
        </div>
        <!-- New Password Field -->
        <div class="relative mb-2">
            <InputField
                label="New Password"
                placeholder="Enter new password"
                name="newPassword"
                bind:value={formObject.newPassword}
                required
                type={showPassword ? 'text' : 'password'}
            />
            <span class="absolute top-4 inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                on:click={() => (showPassword = !showPassword)}>
                <GoogleMatrialIcon iconName={showPassword ? "visibility" : "visibility_off"} addClass="text-base" />
            </span>
        </div>
        <!-- Confirm Password Field -->
        <div class="relative mb-4">
            <InputField
                label="Confirm New Password"
                placeholder="Confirm new password"
                name="confirmPassword"
                bind:value={confirmPassword}
                required
                type={showConfirmPassword ? 'text' : 'password'}
            />
            <span class="absolute top-4 inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                on:click={() => (showConfirmPassword = !showConfirmPassword)}>
                <GoogleMatrialIcon iconName={showConfirmPassword ? "visibility" : "visibility_off"} addClass="text-base" />
            </span>
        </div>
        <div class="flex justify-end gap-2">
            <button type="button" class="px-6 py-2 shadow-sm rounded-[4px] font-medium  capitalize sm:text-sm text-xs text-nowrap text-center flex items-center justify-center gap-1 disabled:bg-gray-90 disabled:cursor-not-allowed hover:bg-opacity-90 bg-gray-30 border border-gray-50 text-primary hover:bg-gray-10" disabled={isSubmitting} on:click={handleCancel}>
                Cancel
            </button>
            <button type="submit" class="px-6 py-2 shadow-sm rounded-[4px] font-medium  capitalize sm:text-sm text-xs text-nowrap text-center flex items-center justify-center gap-1 disabled:bg-gray-90 disabled:cursor-not-allowed hover:bg-opacity-90 text-white bg-primary" disabled={isSubmitting}>
                Submit
            </button>
        </div>
    </form>
</div>
