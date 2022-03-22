<script>
    export let online = false;
</script>

<div class="relative h-12 w-12 rounded-full bg-gray-300 md:h-8 md:w-8">
    {#if online}
        <span
            class="absolute -right-0.5 bottom-0.5 h-4 w-4 rounded-full border-2 border-gray-50 bg-green-500 group-hover:border-gray-100 md:bottom-0 md:h-3 md:w-3"
        />
    {/if}
</div>